import type { Language, Post, Prisma } from '@prisma/client';
import { prisma } from '~/config';
import { SlugService } from '~/services';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary, validate } from '~/utils';
import type { FileBuffer, Paged } from '~/types';
import type { PostBody, PostQuery } from '~/modules/post/schema';
import type { PostDto } from '~/types';

class PostService extends SlugService {
  private model;
  private postTag;
  private tag;

  constructor() {
    super();
    this.model = prisma.post;
    this.tag = prisma.tag;
    this.postTag = prisma.postTag;
  }

  private filterTags = async (
    tags: string[],
    postId?: string
  ): Promise<string[]> => {
    if (!tags.length) {
      if (postId) {
        await this.postTag.deleteMany({ where: { postId } });
      }
      return [];
    }

    const existingTags = await this.tag.findMany({
      where: { id: { in: tags } },
      select: { id: true }
    });

    const validTagIds = existingTags.map(({ id }) => id);
    if (postId) {
      await this.postTag.deleteMany({
        where: {
          postId,
          tagId: { notIn: validTagIds }
        }
      });
    }

    return validTagIds;
  };

  private where = (
    query: PostQuery,
    draft: boolean = false
  ): Prisma.PostWhereInput => {
    const { search, group, relate, tags, category, hot, published, sub } =
      query;

    const conditions: Prisma.PostWhereInput[] = [];

    if (!draft) {
      conditions.push({ published: true });
    } else {
      if (published !== undefined) {
        conditions.push({ published });
      }
    }

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        OR: [
          { slug: filter },
          {
            i18n: {
              some: {
                OR: [{ title: filter }, { summary: filter }]
              }
            }
          },
          {
            tags: {
              some: {
                tag: {
                  OR: [{ slug: filter }, { i18n: { some: { name: filter } } }]
                }
              }
            }
          }
        ]
      });
    }

    if (hot !== undefined) {
      conditions.push({ hot });
    }

    if (group) {
      conditions.push({ group });
    }

    if (relate && relate.length > 0) {
      conditions.push({ relate: { hasSome: relate } });
    }

    if (tags && tags.length > 0) {
      conditions.push({
        tags: {
          some: {
            tag: { slug: { in: tags } }
          }
        }
      });
    }

    if (category) {
      if (category === 'others') {
        conditions.push({
          OR: [{ categoryId: null }, { category: { visible: false } }]
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
    query: PostQuery,
    lang: Language,
    draft: boolean = false
  ): Promise<Paged<PostDto>> => {
    const { page = 1, limit = 10 } = query;
    const where = this.where(query, draft);
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
              title: true,
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
    const items: PostDto[] = entities.map((entity) => {
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
        thumbnail: entity.thumbnail,
        slug: entity.slug,
        title: i18n?.title || 'Không có bản dịch',
        summary: i18n?.summary || '',
        group: entity.group,
        ...(category && { category }),
        hot: entity.hot,
        ...(draft && { published: entity.published }),
        updatedAt: entity.updatedAt,
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

  getById = async (id: string): Promise<Post & { tags: string[] }> => {
    const entity = await this.model.findUnique({
      where: { id },
      include: {
        i18n: { orderBy: { lang: 'asc' } },
        tags: { select: { tagId: true } }
      }
    });
    if (!entity) throw new NotFoundException();
    return { ...entity, tags: entity.tags.map((t) => t.tagId) };
  };

  getBySlug = async (slug: string, lang: Language): Promise<PostDto> => {
    const entity = await this.model.findFirst({
      where: { slug, published: true },
      include: {
        author: true,
        i18n: { where: { lang } },
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
    const i18n = entity.i18n[0];
    return {
      id: entity.id,
      authorName: entity?.author?.name,
      thumbnail: entity.thumbnail,
      title: i18n?.title,
      slug: entity.slug,
      summary: i18n.summary,
      content: i18n.content,
      group: entity.group,
      tags:
        entity.tags?.map((pt) => {
          const tag = pt.tag;
          return {
            id: tag.id,
            name: tag.i18n[0].name,
            slug: tag.slug
          };
        }) ?? [],
      hot: entity.hot,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt
    };
  };

  create = async (data: PostBody, file?: FileBuffer): Promise<Post> => {
    let thumbnail: string | undefined;
    try {
      const { i18n, tags, group, relate, hot, categoryId, published } = data;
      const result = await prisma.$transaction(async (tx) => {
        if (categoryId) {
          const category = await tx.category.count({
            where: { id: categoryId, visible: true },
            select: { id: true }
          });
          if (!category)
            throw new BadRequestException('Danh mục không tồn tại');
        }

        const vi = validate.i18n(i18n);
        const slug = await this.makeSlug('tag', vi.title);

        thumbnail = file ? await cloudinary.upload(file) : undefined;

        const filterTags = tags ? await this.filterTags(tags) : [];

        const post = await tx.post.create({
          data: {
            group,
            relate,
            categoryId,
            thumbnail,
            slug,
            hot: hot ?? false,
            published,
            i18n: { create: i18n },
            tags: {
              create: filterTags.map((id) => ({
                tag: { connect: { id } }
              }))
            }
          },
          include: {
            i18n: true,
            tags: { include: { tag: true } }
          }
        });

        return post;
      });
      return result;
    } catch (error) {
      cloudinary.cleanup(thumbnail);
      throw error;
    }
  };

  update = async (
    id: string,
    data: Partial<PostBody>,
    file?: FileBuffer
  ): Promise<Post & { tags: string[] }> => {
    let thumbnail: string | undefined;

    try {
      const {
        i18n = [],
        tags,
        group,
        relate,
        categoryId,
        published,
        hot
      } = data;
      const result = await prisma.$transaction(async (tx) => {
        const entity = await prisma.post.findUnique({
          where: { id },
          select: { categoryId: true, thumbnail: true }
        });
        if (!entity) {
          throw new NotFoundException();
        }

        const input: Prisma.PostUpdateInput = {};

        if (categoryId !== undefined) {
          if (categoryId && categoryId !== entity.categoryId) {
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

        if (file) {
          thumbnail = await cloudinary.upload(file);
          input.thumbnail = thumbnail;
        }

        if (group !== undefined) input.group = group;
        if (relate !== undefined) input.relate = relate;
        if (hot !== undefined) input.hot = hot;
        if (published !== undefined) input.published = published;

        const vi = i18n.find((t) => t.lang === 'VI');
        if (vi) {
          input.slug = await this.makeSlug('post', vi.title, id);
        }

        await tx.post.update({ where: { id }, data: input });

        if (tags !== undefined) {
          const filterTags = await this.filterTags(tags, id);
          for (const tagId of filterTags) {
            await tx.postTag.upsert({
              where: { postId_tagId: { postId: id, tagId } },
              create: { postId: id, tagId },
              update: {}
            });
          }
        }

        for (const item of i18n) {
          await tx.postI18n.upsert({
            where: {
              postId_lang: { postId: id, lang: item.lang }
            },
            update: item,
            create: { postId: id, ...item }
          });
        }

        if (thumbnail) {
          cloudinary.cleanup(entity.thumbnail);
        }

        const updated = await tx.post.findUnique({
          where: { id },
          include: {
            i18n: { orderBy: { lang: 'asc' } },
            tags: { select: { tagId: true } }
          }
        });

        return updated!;
      });

      return {
        ...result,
        tags: result.tags.map((t) => t.tagId)
      };
    } catch (error) {
      cloudinary.cleanup(thumbnail);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { thumbnail: true }
      });

      if (!entity) throw new NotFoundException();

      await this.model.delete({ where: { id } });

      cloudinary.cleanup(entity.thumbnail);

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new PostService();
