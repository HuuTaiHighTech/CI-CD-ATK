import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary, validate } from '~/utils';
import type { Feedback, Language, Prisma } from '@prisma/client';
import { FeedbackQuery, type FeedbackBody } from '~/modules/feedback/schema';
import type { FeedbackDto, FileBuffer, Paged, Query } from '~/types';

class FeedbackService {
  private model;

  constructor() {
    this.model = prisma.feedback;
  }

  private where = (query: FeedbackQuery): Prisma.FeedbackWhereInput => {
    const { search, star, visible } = query;

    const conditions: Prisma.FeedbackWhereInput[] = [];

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        i18n: {
          some: {
            OR: [{ name: filter }, { position: filter }, { content: filter }]
          }
        }
      });
    }

    if (star !== undefined) {
      conditions.push({ star });
    }

    if (visible !== undefined) {
      conditions.push({ visible });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  get = async (lang: Language = 'VI'): Promise<FeedbackDto[]> => {
    const entities = await this.model.findMany({
      where: { visible: true },
      select: {
        id: true,
        star: true,
        avatar: true,
        createdAt: true,
        i18n: {
          where: { lang },
          select: { name: true, position: true, content: true }
        }
      }
    });
    return entities.map((e) => {
      const i18n = e.i18n[0];
      return {
        id: e.id,
        star: e.star,
        avatar: e.avatar,
        name: i18n?.name || 'Không có bản dịch',
        position: i18n?.position || '-',
        content: i18n?.content,
        createdAt: e.createdAt
      };
    });
  };

  paginate = async (
    query: FeedbackQuery,
    lang: Language
  ): Promise<Paged<FeedbackDto>> => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = this.where(query);

    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        select: {
          id: true,
          star: true,
          avatar: true,
          visible: true,
          createdAt: true,
          updatedAt: true,
          i18n: {
            where: { lang },
            select: {
              name: true,
              position: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    const items: FeedbackDto[] = entities.map((e) => {
      const i18n = e.i18n[0];
      return {
        id: e.id,
        star: e.star,
        avatar: e.avatar,
        name: i18n?.name || 'Không có bản dịch',
        position: i18n?.position || '-',
        visible: e.visible,
        updatedAt: e.updatedAt,
        createdAt: e.createdAt
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

  getById = async (id: string): Promise<Feedback> => {
    const entity = await this.model.findUnique({
      where: { id },
      include: { i18n: { orderBy: { lang: 'asc' } } }
    });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (data: FeedbackBody, file?: FileBuffer): Promise<Feedback> => {
    let avatar: string | undefined;
    try {
      const { star = 0, i18n, visible = false } = data;

      validate.i18n(i18n);

      if (!file) throw new BadRequestException('Hãy tải lên ảnh đại diện');
      avatar = await cloudinary.upload(file);

      const entity = await this.model.create({
        data: { avatar, star, i18n: { create: i18n }, visible }
      });

      return entity;
    } catch (error) {
      if (avatar) cloudinary.cleanup(avatar);
      throw error;
    }
  };

  update = async (
    id: string,
    data: Partial<FeedbackBody>,
    file?: FileBuffer
  ): Promise<Feedback> => {
    let avatar: string | undefined;

    try {
      const { star, i18n, visible } = data;

      const result = await prisma.$transaction(async (tx) => {
        const entity = await this.model.findUnique({
          where: { id },
          select: { avatar: true }
        });

        if (!entity) throw new NotFoundException();

        const input: Prisma.FeedbackUpdateInput = {};

        if (star !== undefined) input.star = star;
        if (visible !== undefined) input.visible = visible;

        if (file) {
          avatar = await cloudinary.upload(file);
          input.avatar = avatar;
        }

        await this.model.update({ where: { id }, data: input });

        for (const item of i18n ?? []) {
          await tx.feedbackI18n.upsert({
            where: {
              feedbackId_lang: {
                feedbackId: id,
                lang: item.lang
              }
            },
            update: item,
            create: { feedbackId: id, ...item }
          });
        }

        if (file) {
          cloudinary.cleanup(entity.avatar);
        }

        return await tx.feedback.findUnique({
          where: { id },
          include: { i18n: { orderBy: { lang: 'asc' } } }
        });
      });

      return result!;
    } catch (error) {
      if (avatar) cloudinary.cleanup(avatar);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { avatar: true }
      });

      if (!entity) {
        throw new NotFoundException();
      }

      await this.model.delete({ where: { id } });

      if (entity.avatar) {
        cloudinary.cleanup(entity.avatar);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new FeedbackService();
