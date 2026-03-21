import type { Partner, Prisma } from '@prisma/client';
import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary } from '~/utils';
import type { FileBuffer, Paged, Query } from '~/types';
import { type PartnerBody } from '~/modules/partner/schema';

class PartnerService {
  private model;

  constructor() {
    this.model = prisma.partner;
  }

  get = async (): Promise<Partner[]> => {
    const entities = await this.model.findMany({
      where: { visible: true }
    });
    return entities;
  };

  paginate = async (query: Query): Promise<Paged<Partner>> => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PartnerWhereInput = search
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

  getById = async (id: string): Promise<Partner> => {
    const entity = await this.model.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (data: PartnerBody, file?: FileBuffer): Promise<void> => {
    let logo: string | undefined;
    try {
      if (!file) throw new BadRequestException('Hãy tải ảnh lên.');
      logo = await cloudinary.upload(file);

      await this.model.create({
        data: {
          logo,
          name: data.name,
          url: data.url,
          visible: data.visible ?? false
        }
      });
    } catch (error) {
      cloudinary.cleanup(logo);
      throw error;
    }
  };

  update = async (
    id: string,
    data: Partial<PartnerBody>,
    file?: FileBuffer
  ): Promise<Partner> => {
    let logo: string | undefined;
    try {
      const { name, url, visible, order } = data;
      const entity = await this.model.findUnique({
        where: { id },
        select: { logo: true }
      });
      if (!entity) throw new NotFoundException();

      const input: Prisma.PartnerUpdateInput = {};

      if (name) input.name = name;
      if (url) input.url = url;
      if (visible !== undefined) input.visible = visible;
      if (file) {
        logo = await cloudinary.upload(file);
        input.logo = logo;
      }

      const partner = await this.model.update({
        where: { id },
        data: input
      });

      if (logo) {
        cloudinary.cleanup(entity.logo);
      }

      return partner;
    } catch (error) {
      cloudinary.cleanup(logo);
      throw error;
    }
  };

  delete = async (id: string): Promise<boolean> => {
    try {
      const entity = await this.model.findUnique({
        where: { id },
        select: { logo: true }
      });

      if (!entity) throw new NotFoundException();

      await this.model.delete({ where: { id } });

      cloudinary.cleanup(entity.logo);

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new PartnerService();
