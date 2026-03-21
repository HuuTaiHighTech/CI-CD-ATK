import type { Banner, Language, Prisma } from '@prisma/client';
import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary, toStringArray } from '~/utils';
import type { FileBuffer, Paged, Query } from '~/types';
import { BannerBody } from '~/modules/banner/schema';

class BannerService {
  private model;

  constructor() {
    this.model = prisma.banner;
  }

  private where = (search?: string): Prisma.BannerWhereInput => {
    const conditions: Prisma.BannerWhereInput[] = [];

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        OR: [{ key: filter }, { name: filter }]
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  paginate = async (query: Query, lang: Language): Promise<Paged<Banner>> => {
    const { page = 1, limit = 10, search } = query;
    const where = this.where(search);
    const skip = (page - 1) * limit;

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

  getById = async (id: string): Promise<Banner> => {
    const entity = await this.model.findUnique({
      where: { id }
    });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  getByKey = async (key: string): Promise<Banner> => {
    const entity = await this.model.findUnique({
      where: { key }
    });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (data: BannerBody, files: FileBuffer[]): Promise<Banner> => {
    let images: string[] = [];
    try {
      const { key, name } = data;

      const existed = await prisma.banner.findUnique({
        where: { key }
      });

      if (existed) {
        throw new BadRequestException('Key đã tồn tại.');
      }

      if (!files || files.length === 0 || files.length > 10) {
        throw new BadRequestException(
          'Bạn cần tải lên ít nhất 1 ảnh và tối đa 10 ảnh.'
        );
      }

      images = await cloudinary.upload(files);

      const result = await prisma.$transaction(async (tx) => {
        const entity = await tx.banner.create({
          data: { key, name, images }
        });

        return entity;
      });

      return result;
    } catch (error) {
      cloudinary.cleanup(images);
      throw error;
    }
  };

  update = async (
    id: string,
    data: Partial<BannerBody>,
    files?: FileBuffer[]
  ): Promise<Banner> => {
    let uploadedImages: string[] = [];
    let imagesToDelete: string[] = [];

    try {
      const { key, name, images } = data;
      const result = await prisma.$transaction(async (tx) => {
        const entity = await tx.banner.findUnique({
          where: { id },
          select: { images: true }
        });

        if (!entity) throw new NotFoundException();

        const input: Prisma.BannerUpdateInput = {};

        if (key !== undefined) {
          const existed = await tx.banner.findFirst({
            where: {
              key,
              NOT: { id }
            }
          });

          if (existed) {
            throw new BadRequestException('Key đã tồn tại.');
          }

          input.key = key;
        }
        if (name !== undefined) input.name = name;

        if (images !== undefined || files?.length) {
          const count =
            (images?.filter(Boolean).length || 0) + (files?.length || 0);
          if (count === 0 || count > 10) {
            throw new BadRequestException(
              'Bạn cần tải lên ít nhất 1 ảnh và tối đa 10 ảnh.'
            );
          }

          const imagesInDB = toStringArray(entity.images);
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

        await tx.banner.update({ where: { id }, data: input });

        const banner = await tx.banner.findUnique({
          where: { id }
        });

        return banner!;
      });

      if (imagesToDelete.length) {
        cloudinary.cleanup(imagesToDelete);
      }

      return result;
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

export default new BannerService();
