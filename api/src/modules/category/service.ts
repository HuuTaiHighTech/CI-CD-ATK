import type { Category, Language, Prisma } from '@prisma/client';
import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary, validate } from '~/utils';
import type {
  CategoryDto,
  ChildrenWithProducts,
  FileBuffer,
  Paged
} from '~/types';
import {
  type CategoryQuery,
  type CategoryBody
} from '~/modules/category/schema';
import { SlugService } from '~/services';

class CategoryService extends SlugService {
  private model;

  constructor() {
    super();
    this.model = prisma.category;
  }

  private hasCycle = async (
    id: string,
    parentId?: string | null
  ): Promise<boolean> => {
    if (!parentId) return false;
    if (id === parentId) return true;

    const result = await prisma.$queryRaw<{ id: string }[]>`
         WITH RECURSIVE ancestors AS (
            SELECT id, "parentId"
            FROM "categories"
            WHERE id = ${parentId}
            UNION ALL
            SELECT c.id, c."parentId"
            FROM "categories" c
            INNER JOIN ancestors a ON c.id = a."parentId"
            WHERE a.id != ${id}
         )
         SELECT id FROM ancestors WHERE id = ${id} LIMIT 1`;

    return result.length > 0;
  };

  private descendantsOf = async (id: string): Promise<string[]> => {
    const result = await prisma.$queryRaw<{ id: string }[]>`
      WITH RECURSIVE descendants AS (
         SELECT id, "parentId" FROM "categories" WHERE id = ${id}
         UNION ALL
         SELECT c.id, c."parentId"
         FROM "categories" c
         INNER JOIN descendants d ON c."parentId" = d.id
         WHERE c.id != ${id}
      )
      SELECT id FROM descendants`;

    return result.map((r) => r.id);
  };

  private validateParent = async (
    id: string,
    parentId: string | null
  ): Promise<void> => {
    if (!parentId) return;

    if (parentId === id)
      throw new BadRequestException('Danh mục không thể là cha của chính nó');

    const parent = await this.model.findFirst({
      where: { id: parentId, visible: true },
      select: { id: true }
    });
    if (!parent) throw new BadRequestException('Danh mục cha không tồn tại');

    const isCircular = await this.hasCycle(id, parentId);
    if (isCircular)
      throw new BadRequestException('Không thể tạo vòng lặp phân cấp danh mục');
  };

  private where = (
    query: CategoryQuery,
    draft: boolean = false
  ): Prisma.CategoryWhereInput => {
    const { search, visible } = query;
    const conditions: Prisma.CategoryWhereInput[] = [];

    if (!draft) {
      conditions.push({ visible: true });
    } else {
      if (visible !== undefined) {
        conditions.push({ visible });
      }
    }

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        OR: [{ slug: filter }, { i18n: { some: { name: filter } } }]
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  paginate = async (
    query: CategoryQuery,
    lang: Language,
    draft: boolean = false
  ): Promise<Paged<CategoryDto>> => {
    const { page = 1, limit = 10 } = query;
    const where = this.where(query, draft);
    const skip = (page - 1) * limit;

    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        include: {
          i18n: {
            where: { lang },
            select: { name: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    const items = entities.map((entity) => {
      const i18n = entity?.i18n[0];
      return {
        id: entity.id,
        image: entity.image,
        name: i18n?.name,
        slug: entity.slug,
        parentId: entity.parentId,
        ...(draft && {
          visible: entity.visible,
          updatedAt: entity.updatedAt
        }),
        createdAt: entity.createdAt
      };
    });
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  };

  getTree = async (
    slug: string,
    lang: Language = 'VI'
  ): Promise<ChildrenWithProducts[]> => {
    const category = await this.model.findUnique({
      where: {
        slug,
        visible: true
      },
      select: {
        id: true,
        slug: true,
        image: true,
        i18n: {
          where: { lang },
          select: { name: true }
        },
        products: {
          where: { visible: true },
          select: {
            id: true,
            slug: true,
            images: true,
            i18n: {
              where: { lang },
              select: { name: true, summary: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        children: {
          where: {
            visible: true,
            i18n: { some: { lang } }
          },
          select: {
            id: true,
            slug: true,
            image: true,
            i18n: {
              where: { lang },
              select: { name: true }
            },
            products: {
              where: { visible: true },
              select: {
                id: true,
                slug: true,
                images: true,
                i18n: {
                  where: { lang },
                  select: { name: true, summary: true }
                }
              },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!category) return [];

    const self: ChildrenWithProducts = {
      id: category.id,
      slug: category.slug,
      image: category.image,
      name: category.i18n[0]?.name || '',
      products: category.products.map((p) => ({
        id: p.id,
        slug: p.slug,
        images: p.images,
        name: p.i18n[0]?.name || '',
        summary: p.i18n[0]?.summary || null
      }))
    };

    const children = category.children.map((child) => ({
      id: child.id,
      slug: child.slug,
      image: child.image,
      name: child.i18n[0]?.name || '',
      products: child.products.map((p) => ({
        id: p.id,
        slug: p.slug,
        images: p.images,
        name: p.i18n[0]?.name || '',
        summary: p.i18n[0]?.summary || null
      }))
    }));

    return [self, ...children];
  };

  getSummary = async (
    excludeId?: string,
    lang: Language = 'VI'
  ): Promise<CategoryDto[]> => {
    let ids: string[] = [];
    if (excludeId) {
      ids = await this.descendantsOf(excludeId);
    }

    const where: Prisma.CategoryWhereInput = {
      visible: true,
      id: { notIn: Array.from(ids) },
      i18n: { some: { lang } }
    };

    const entities = await this.model.findMany({
      where,
      select: {
        id: true,
        parentId: true,
        slug: true,
        i18n: {
          where: { lang },
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return entities.map((cat) => {
      const i18n = cat.i18n[0];
      return {
        id: cat.id,
        name: i18n?.name,
        slug: cat.slug,
        parentId: cat.parentId
      };
    });
  };

  getParent = async (lang: Language = 'VI'): Promise<CategoryDto[]> => {
    const where: Prisma.CategoryWhereInput = {
      visible: true,
      parentId: null,
      i18n: { some: { lang } }
    };

    const entities = await this.model.findMany({
      where,
      select: {
        id: true,
        parentId: true,
        slug: true,
        i18n: {
          where: { lang },
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return entities.map((cat) => {
      const i18n = cat.i18n[0];
      return {
        id: cat.id,
        name: i18n?.name,
        slug: cat.slug,
        parentId: cat.parentId
      };
    });
  };

  getById = async (id: string): Promise<Category> => {
    const entity = await this.model.findUnique({
      where: { id },
      include: { i18n: { orderBy: { lang: 'asc' } } }
    });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  getBySlug = async (slug: string, lang: Language): Promise<CategoryDto> => {
    const entity = await this.model.findFirst({
      where: { slug, visible: true },
      include: { i18n: { where: { lang } } }
    });
    if (!entity) throw new NotFoundException();
    const i18n = entity?.i18n[0];
    return {
      id: entity.id,
      image: entity.image,
      name: i18n?.name,
      slug: entity.slug,
      description: i18n?.description,
      parentId: entity.parentId,
      createdAt: entity.createdAt
    };
  };

  create = async (data: CategoryBody, file?: FileBuffer): Promise<Category> => {
    let image: string | undefined;
    try {
      const { parentId, i18n, visible = false } = data;
      const result = await prisma.$transaction(async (tx) => {
        if (parentId) {
          const parent = await tx.category.findFirst({
            where: { id: parentId, visible: true },
            select: { id: true }
          });
          if (!parent)
            throw new NotFoundException('Danh mục cha không tồn tại');
        }

        const vi = validate.i18n(i18n);
        const slug = await this.makeSlug('category', vi.name);

        image = file ? await cloudinary.upload(file) : undefined;

        const category = await tx.category.create({
          data: {
            parentId,
            image,
            slug,
            visible,
            i18n: { create: i18n }
          }
        });

        return category;
      });
      return result;
    } catch (error) {
      cloudinary.cleanup(image);
      throw error;
    }
  };

  update = async (
    id: string,
    data: CategoryBody,
    file?: FileBuffer
  ): Promise<Category> => {
    let image: string | undefined;

    try {
      const { parentId, i18n = [], visible } = data;
      const result = await prisma.$transaction(async (tx) => {
        const entity = await tx.category.findUnique({
          where: { id },
          select: { parentId: true, image: true }
        });
        if (!entity) throw new NotFoundException();

        const input: Prisma.CategoryUpdateInput = {};

        if (parentId !== undefined && parentId !== entity.parentId) {
          await this.validateParent(id, parentId);
          input.parent = parentId
            ? { connect: { id: parentId } }
            : { disconnect: true };
        }

        if (file) {
          image = await cloudinary.upload(file);
          input.image = image;
        }

        if (visible !== undefined) input.visible = visible;

        const vi = i18n.find((t) => t.lang === 'VI');
        if (vi) {
          input.slug = await this.makeSlug('category', vi.name, id);
        }

        await tx.category.update({ where: { id }, data: input });

        for (const item of i18n) {
          await tx.categoryI18n.upsert({
            where: {
              categoryId_lang: {
                categoryId: id,
                lang: item.lang
              }
            },
            update: item,
            create: { categoryId: id, ...item }
          });
        }

        if (file) {
          cloudinary.cleanup(entity.image);
        }

        return await tx.category.findUnique({
          where: { id },
          include: { i18n: { orderBy: { lang: 'asc' } } }
        });
      });

      return result!;
    } catch (error) {
      cloudinary.cleanup(image);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { image: true }
      });

      if (!entity) throw new NotFoundException();

      await this.model.delete({ where: { id } });

      cloudinary.cleanup(entity.image);

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new CategoryService();
