import { prisma } from '~/config';
import type { Prisma, Language, PinProduct } from '@prisma/client';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary } from '~/utils';
import type { FileBuffer, PinProductDto, Paged, Query } from '~/types';
import { PinProductBody } from '~/modules/pin-product/schema';

class PinProductService {
  private model;
  private product;

  constructor() {
    this.model = prisma.pinProduct;
    this.product = prisma.product;
  }

  private where = (query: Query): Prisma.PinProductWhereInput => {
    const { search } = query;

    const conditions: Prisma.PinProductWhereInput[] = [];

    const trimmed = search?.trim();
    if (trimmed) {
      const filter = { contains: trimmed, mode: 'insensitive' } as const;
      conditions.push({
        OR: [
          { product: { slug: filter } },
          { product: { i18n: { some: { name: filter } } } },
          { product: { i18n: { some: { summary: filter } } } }
        ]
      });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  paginate = async (
    query: Query,
    lang: Language
  ): Promise<Paged<PinProductDto>> => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = this.where(query);

    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        select: {
          id: true,
          image: true,
          updatedAt: true,
          createdAt: true,
          product: {
            select: {
              slug: true,
              i18n: {
                where: { lang },
                select: { name: true }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }
      }),
      this.model.count({ where })
    ]);

    const items: PinProductDto[] = entities.map((t) => ({
      id: t.id,
      image: t.image,
      slug: t.product.slug,
      name: t.product.i18n[0]?.name ?? 'Không có bản dịch',
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

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

  getById = async (id: string): Promise<PinProduct> => {
    const entity = await this.model.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (
    data: PinProductBody,
    file?: FileBuffer
  ): Promise<PinProduct> => {
    let image: string | undefined;
    try {
      const { productId } = data;
      if (!file) throw new BadRequestException('Hãy tải ảnh lên');
      image = await cloudinary.upload(file);

      const product = await this.product.findFirst({
        where: { id: productId, visible: true },
        select: { id: true }
      });
      if (!product) throw new BadRequestException('Sản phẩm không tồn tại');

      const existed = await this.model.findFirst({
        where: { productId }
      });
      if (existed) {
        throw new BadRequestException(
          'Sản phẩm này đã nằm trong sản phẩm ghim.'
        );
      }

      const entity = await this.model.create({
        data: { productId, image }
      });

      return entity;
    } catch (error) {
      cloudinary.cleanup(image);
      throw error;
    }
  };

  update = async (
    id: string,
    data: PinProductBody,
    file?: FileBuffer
  ): Promise<PinProduct> => {
    let image: string | undefined;

    try {
      const { productId } = data;

      const entity = await this.model.findUnique({
        where: { id },
        select: { productId: true, image: true }
      });
      if (!entity) throw new NotFoundException();

      const input: Prisma.PinProductUpdateInput = {};

      if (productId && productId !== entity.productId) {
        const product = await this.product.findFirst({
          where: { id: productId, visible: true },
          select: { id: true }
        });
        if (!product) {
          throw new NotFoundException('Sản phẩm không tồn tại.');
        }

        const existed = await this.model.findFirst({
          where: { productId, NOT: { id } }
        });
        if (existed) {
          throw new BadRequestException(
            'Sản phẩm này đã nằm trong sản phẩm ghim.'
          );
        }

        input.product = { connect: { id: productId } };
      }

      if (file) {
        image = await cloudinary.upload(file);
        input.image = image;
      }

      await this.model.update({ where: { id }, data: input });

      if (file) {
        cloudinary.cleanup(entity.image);
      }

      const result = await this.model.findUnique({
        where: { id }
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

      if (!entity) {
        throw new NotFoundException();
      }

      await this.model.delete({ where: { id } });

      if (entity.image) {
        cloudinary.cleanup(entity.image);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new PinProductService();
