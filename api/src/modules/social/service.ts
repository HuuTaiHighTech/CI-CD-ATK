import type { Prisma, Social } from '@prisma/client';
import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary } from '~/utils';
import type { FileBuffer, Paged, Query } from '~/types';
import { type SocialBody } from '~/modules/social/schema';

class SocialService {
  private model;

  constructor() {
    this.model = prisma.social;
  }

  get = async (): Promise<Social[]> => {
    const entities = await this.model.findMany({
      where: { visible: true }
    });
    return entities;
  };

  paginate = async (query: Query): Promise<Paged<Social>> => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SocialWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    return {
      items: entities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  };

  getById = async (id: string): Promise<Social> => {
    const entity = await this.model.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (data: SocialBody, file?: FileBuffer): Promise<void> => {
    let icon: string | undefined;
    try {
      if (!file) throw new BadRequestException('Hãy tải ảnh lên.');
      icon = await cloudinary.upload(file);

      await this.model.create({
        data: {
          icon,
          name: data.name,
          url: data.url,
          visible: data.visible ?? false
        }
      });
    } catch (error) {
      cloudinary.cleanup(icon);
      throw error;
    }
  };

  update = async (
    id: string,
    data: Partial<SocialBody>,
    file?: FileBuffer
  ): Promise<Social> => {
    let icon: string | undefined;
    try {
      const { name, url, visible } = data;

      const entity = await this.model.findUnique({
        where: { id },
        select: { icon: true }
      });
      if (!entity) throw new NotFoundException();

      const input: Prisma.SocialUpdateInput = {};

      if (name) input.name = name;
      if (url) input.url = url;
      if (visible !== undefined) input.visible = visible;

      if (file) {
        icon = await cloudinary.upload(file);
        input.icon = icon;
      }

      const social = await this.model.update({
        where: { id },
        data: input
      });

      if (icon) {
        cloudinary.cleanup(entity.icon);
      }

      return social;
    } catch (error) {
      cloudinary.cleanup(icon);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { icon: true }
      });

      if (!entity) throw new NotFoundException();

      await this.model.delete({ where: { id } });

      cloudinary.cleanup(entity.icon);

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new SocialService();
