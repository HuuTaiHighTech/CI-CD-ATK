import { prisma } from '~/config';
import type { Language, Prisma, Tag } from '@prisma/client';
import { NotFoundException } from '~/exceptions';
import type { Paged } from '~/types';
import type { TagDto } from '~/types';
import { SlugService } from '~/services';
import { validate } from '~/utils';
import { TagQuery, type TagBody } from '~/modules/tag/schema';

class TagService extends SlugService {
  private model;

  constructor() {
    super();
    this.model = prisma.tag;
  }

  private where = (search?: string, hot?: boolean): Prisma.TagWhereInput => {
    const conditions: Prisma.TagWhereInput[] = [];

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        OR: [{ slug: filter }, { i18n: { some: { name: filter } } }]
      });
    }

    if (hot !== undefined) {
      conditions.push({ hot });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  get = async (lang: Language): Promise<TagDto[]> => {
    const entities = await this.model.findMany({
      include: { i18n: { where: { lang } } }
    });
    return entities.map((entity) => {
      const i18n = entity.i18n[0];
      return { id: entity.id, name: i18n.name, slug: entity.slug };
    });
  };

  getHot = async (lang: Language): Promise<TagDto[]> => {
    const entities = await this.model.findMany({
      where: { hot: true },
      include: { i18n: { where: { lang } } }
    });
    return entities.map((entity) => {
      const i18n = entity.i18n[0];
      return { id: entity.id, name: i18n.name, slug: entity.slug };
    });
  };

  paginate = async (
    query: TagQuery,
    lang: Language
  ): Promise<Paged<TagDto>> => {
    const { page = 1, limit = 10, search, hot } = query;
    const where = this.where(search, hot);
    const skip = (page - 1) * limit;
    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        include: {
          i18n: { where: { lang } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    const items = entities.map((entity) => {
      const i18n = entity.i18n[0];
      return {
        id: entity.id,
        name: i18n?.name,
        slug: entity.slug,
        hot: entity.hot,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
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

  getBySlug = async (slug: string, lang: Language): Promise<TagDto> => {
    const entity = await this.model.findUnique({
      where: { slug },
      include: { i18n: { where: { lang } } }
    });
    if (!entity) throw new NotFoundException();
    const i18n = entity?.i18n[0];
    return {
      id: entity.id,
      slug: entity.slug,
      name: i18n?.name
    };
  };

  getById = async (id: string): Promise<Tag> => {
    const entity = await this.model.findUnique({
      where: { id },
      include: { i18n: { orderBy: { lang: 'asc' } } }
    });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (data: TagBody): Promise<Tag> => {
    try {
      const { i18n, hot = false } = data;
      const result = await prisma.$transaction(async (tx) => {
        const vi = validate.i18n(i18n);
        const slug = await this.makeSlug('tag', vi.name);

        const tag = await tx.tag.create({
          data: { slug, i18n: { create: i18n }, hot }
        });

        return tag;
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  update = async (id: string, data: TagBody): Promise<Tag> => {
    try {
      const { i18n = [], hot } = data;
      const result = await prisma.$transaction(async (tx) => {
        const tag = await tx.tag.findUnique({
          where: { id }
        });

        if (!tag) {
          throw new NotFoundException();
        }

        const input: Prisma.TagUpdateInput = {};

        if (hot !== undefined) input.hot = hot;

        const vi = i18n.find((t) => t.lang === 'VI');
        if (vi) {
          input.slug = await this.makeSlug('tag', vi.name, id);
        }

        await tx.tag.update({ where: { id }, data: input });

        for (const item of i18n) {
          await tx.tagI18n.upsert({
            where: {
              tagId_lang: {
                tagId: id,
                lang: item.lang
              }
            },
            update: item,
            create: { tagId: id, ...item }
          });
        }

        return tx.tag.findUnique({
          where: { id },
          include: { i18n: { orderBy: { lang: 'asc' } } }
        });
      });

      return result!;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      await this.model.delete({ where: { id } });
      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new TagService();
