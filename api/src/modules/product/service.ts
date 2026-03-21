import type { Language, Prisma, Product } from '@prisma/client';
import { prisma } from '~/config';
import { SlugService } from '~/services';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { toStringArray, cloudinary, validate } from '~/utils';
import type { FileBuffer, Paged, ProductDto, ProductSummary } from '~/types';
import { type ProductBody, type ProductQuery } from '~/modules/product/schema';

class ProductService extends SlugService {
  private model;
  private topProduct;
  private pinProduct;
  private productTag;
  private tag;

  constructor() {
    super();
    this.model = prisma.product;
    this.topProduct = prisma.topProduct;
    this.pinProduct = prisma.pinProduct;
    this.tag = prisma.tag;
    this.productTag = prisma.productTag;
  }

  private filterTags = async (
    tags: string[],
    productId?: string
  ): Promise<string[]> => {
    if (!tags.length) {
      if (productId) {
        await this.productTag.deleteMany({ where: { productId } });
      }
      return [];
    }

    const existingTags = await this.tag.findMany({
      where: { id: { in: tags } },
      select: { id: true }
    });

    const validTagIds = existingTags.map(({ id }) => id);
    if (productId) {
      await this.productTag.deleteMany({
        where: {
          productId,
          tagId: { notIn: validTagIds }
        }
      });
    }

    return validTagIds;
  };

  private where = async (
    query: ProductQuery,
    draft: boolean = false
  ): Promise<Prisma.ProductWhereInput> => {
    const { search, category, visible, sub } = query;
    const conditions: Prisma.ProductWhereInput[] = [];

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
        OR: [
          { slug: filter },
          { i18n: { some: { name: filter } } },
          { i18n: { some: { summary: filter } } },
          { category: { slug: filter } },
          { category: { i18n: { some: { name: filter } } } }
        ]
      });
    }

    if (category) {
      if (category === 'others') {
        conditions.push({
          OR: [
            { categoryId: null },
            { category: { visible: false } },
            {
              category: {
                visible: true,
                parent: {
                  visible: false
                }
              }
            }
          ]
        });
      } else {
        if (sub === true) {
          conditions.push({
            category: {
              visible: true,
              OR: [
                { slug: category },
                { parent: { slug: category, visible: true } }
              ]
            }
          });
        } else {
          conditions.push({ category: { slug: category } });
        }
      }
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  paginate = async (
    query: ProductQuery,
    lang: Language,
    draft: boolean = false
  ): Promise<Paged<ProductDto>> => {
    const { page = 1, limit = 10 } = query;
    const where = await this.where(query, draft);
    const skip = (page - 1) * limit;
    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        include: {
          category: {
            where: { visible: true },
            include: {
              i18n: {
                where: { lang },
                select: { name: true }
              }
            }
          },
          i18n: {
            where: { lang },
            select: {
              name: true,
              summary: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    const items = entities.map((entity) => {
      const i18n = entity.i18n?.[0];
      const category =
        entity.category && entity.category.i18n?.length
          ? {
              id: entity.category.id,
              name: entity.category.i18n[0].name,
              slug: entity.category.slug
            }
          : null;

      return {
        id: entity.id,
        images: entity.images,
        slug: entity.slug,
        name: i18n?.name || 'Không có bản dịch',
        summary: i18n?.summary || '',
        ...(category && { category }),
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

  getSummary = async (lang: Language): Promise<ProductSummary[]> => {
    const entities = await this.model.findMany({
      where: { visible: true },
      select: {
        id: true,
        i18n: {
          where: { lang },
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    return entities.map((e) => ({
      id: e.id,
      name: e.i18n[0]?.name ?? 'Không có bản dịch'
    }));
  };

  getTop = async (lang: Language): Promise<ProductSummary[]> => {
    const entities = await this.topProduct.findMany({
      where: {
        visible: true,
        product: {
          visible: true
        }
      },
      select: {
        id: true,
        thumbnail: true,
        product: {
          select: {
            slug: true,
            i18n: {
              where: { lang },
              select: {
                name: true,
                summary: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return entities.map((e) => {
      const i18n = e.product.i18n[0];

      return {
        id: e.id,
        thumbnail: e.thumbnail,
        slug: e.product.slug,
        name: i18n?.name ?? 'Không có bản dịch',
        summary: i18n?.summary ?? ''
      };
    });
  };

  getPinned = async (lang: Language): Promise<ProductSummary[]> => {
    const entities = await this.pinProduct.findMany({
      where: {
        product: {
          visible: true
        }
      },
      select: {
        id: true,
        image: true,
        product: {
          select: {
            slug: true,
            i18n: {
              where: { lang },
              select: {
                name: true,
                summary: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return entities.map((e) => {
      const i18n = e.product.i18n[0];

      return {
        id: e.id,
        image: e.image,
        slug: e.product.slug,
        name: i18n?.name ?? 'Không có bản dịch',
        summary: i18n?.summary ?? ''
      };
    });
  };

  getById = async (id: string): Promise<Product & { tags: string[] }> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        i18n: { orderBy: { lang: 'asc' } },
        tags: { select: { tagId: true } }
      }
    });
    if (!product) throw new NotFoundException();
    return { ...product, tags: product.tags.map((t) => t.tagId) };
  };

  getBySlug = async (slug: string, lang: Language): Promise<ProductDto> => {
    const entity = await this.model.findFirst({
      where: { slug, visible: true },
      include: {
        i18n: { where: { lang } },
        category: {
          where: {
            visible: true,
            i18n: { some: { lang } }
          },
          include: { i18n: { where: { lang } } }
        },
        tags: {
          include: {
            tag: {
              include: { i18n: { where: { lang } } }
            }
          }
        }
      }
    });

    if (!entity) throw new NotFoundException();
    const i18n = entity.i18n?.[0];
    const category =
      entity.category && entity.category.i18n?.length
        ? {
            id: entity.category.id,
            name: entity.category.i18n[0].name,
            slug: entity.category.slug
          }
        : null;

    return {
      id: entity.id,
      name: i18n?.name || 'Không có bản dịch',
      images: entity.images,
      slug: entity.slug,
      summary: i18n?.summary || '',
      description: i18n?.description || null,
      features: i18n?.features || [],
      ...(category && { category }),
      tags:
        entity.tags?.map((pt) => {
          const tag = pt.tag;
          return {
            id: tag.id,
            name: tag.i18n[0].name ?? 'Không có bản dịch',
            slug: tag.slug
          };
        }) ?? [],
      createdAt: entity.createdAt
    };
  };

  create = async (
    data: ProductBody,
    files?: FileBuffer[]
  ): Promise<Product> => {
    let images: string[] = [];
    try {
      const { i18n, categoryId, tags, visible = false } = data;
      const result = await prisma.$transaction(async (tx) => {
        if (categoryId) {
          const category = await tx.category.count({
            where: { id: categoryId, visible: true },
            select: { id: true }
          });
          if (!category)
            throw new BadRequestException('Danh mục không tồn tại');
        }

        const filterTags = tags ? await this.filterTags(tags) : [];

        const vi = validate.i18n(i18n);
        const slug = await this.makeSlug('product', vi.name);

        if (!files || files.length === 0 || files.length > 10) {
          throw new BadRequestException(
            'Bạn cần tải lên ít nhất 1 ảnh và tối đa 10 ảnh.'
          );
        }

        images = await cloudinary.upload(files);

        const product = await tx.product.create({
          data: {
            images,
            slug,
            categoryId,
            visible,
            i18n: { create: i18n },
            tags: {
              create: filterTags.map((id) => ({
                tag: { connect: { id } }
              }))
            }
          }
        });

        return product;
      });

      return result;
    } catch (error) {
      cloudinary.cleanup(images);
      throw error;
    }
  };

  update = async (
    id: string,
    data: ProductBody,
    files?: FileBuffer[]
  ): Promise<Product & { tags: string[] }> => {
    let uploadedImages: string[] = [];
    let imagesToDelete: string[] = [];

    try {
      const { categoryId, i18n = [], images, tags, visible } = data;
      const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: { id },
          select: { categoryId: true, images: true }
        });

        if (!product) throw new NotFoundException('Sản phẩm không tồn tại.');

        const input: Prisma.ProductUpdateInput = {};

        if (categoryId !== undefined) {
          if (categoryId && categoryId !== product.categoryId) {
            const category = await tx.category.findFirst({
              where: { id: categoryId, visible: true },
              select: { id: true }
            });
            if (!category) {
              throw new NotFoundException('Danh mục không tồn tại.');
            }
          }
          input.category = categoryId
            ? { connect: { id: categoryId } }
            : { disconnect: true };
        }

        if (visible !== undefined) input.visible = visible;

        if (images !== undefined || files?.length) {
          const count =
            (images?.filter(Boolean).length || 0) + (files?.length || 0);
          if (count === 0 || count > 10) {
            throw new BadRequestException(
              'Bạn cần tải lên ít nhất 1 ảnh và tối đa 10 ảnh.'
            );
          }

          const imagesInDB = toStringArray(product.images);
          imagesToDelete = imagesInDB.filter(
            (img) => !images?.filter(Boolean).includes(img)
          );

          uploadedImages = files?.length ? await cloudinary.upload(files) : [];

          const imgs: string[] = [];
          let uploaded = [...uploadedImages];

          for (const img of images || []) {
            if (img) {
              imgs.push(img);
            } else if (uploaded.length) {
              imgs.push(uploaded.shift()!);
            }
          }

          for (const name of uploaded) {
            imgs.push(name);
          }

          input.images = imgs;
        }

        const vi = i18n.find((t) => t.lang === 'VI');
        if (vi) {
          input.slug = await this.makeSlug('product', vi.name, id);
        }

        await tx.product.update({ where: { id }, data: input });

        if (tags !== undefined) {
          const filterTags = await this.filterTags(tags, id);
          for (const tagId of filterTags) {
            await tx.productTag.upsert({
              where: { productId_tagId: { productId: id, tagId } },
              create: { productId: id, tagId },
              update: {}
            });
          }
        }

        for (const item of i18n) {
          await tx.productI18n.upsert({
            where: {
              productId_lang: {
                productId: id,
                lang: item.lang
              }
            },
            create: { productId: id, ...item },
            update: item
          });
        }

        const updated = await tx.product.findUnique({
          where: { id },
          include: {
            i18n: { orderBy: { lang: 'asc' } },
            tags: { select: { tagId: true } }
          }
        });

        return updated!;
      });

      if (imagesToDelete.length) {
        cloudinary.cleanup(imagesToDelete);
      }

      return {
        ...result,
        tags: result.tags.map((t) => t.tagId)
      };
    } catch (error) {
      cloudinary.cleanup(uploadedImages);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { images: true }
      });

      if (!entity) throw new NotFoundException();

      await this.model.delete({ where: { id } });

      cloudinary.cleanup(toStringArray(entity.images));

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new ProductService();
