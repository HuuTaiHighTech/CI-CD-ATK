import { prisma } from '~/config';
import { BadRequestException, NotFoundException } from '~/exceptions';
import { cloudinary } from '~/utils';
import type { Language, Prisma, TopProduct } from '@prisma/client';
import type { FileBuffer, Paged, TopProductDto } from '~/types';
import {
  type TopProductBody,
  type TopProductQuery
} from '~/modules/top-product/schema';

class TopProductService {
  private model;
  private product;

  constructor() {
    this.model = prisma.topProduct;
    this.product = prisma.product;
  }

  private where = (query: TopProductQuery): Prisma.TopProductWhereInput => {
    const { search, visible } = query;

    const conditions: Prisma.TopProductWhereInput[] = [];

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

    if (visible !== undefined) {
      conditions.push({ visible });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  };

  paginate = async (
    query: TopProductQuery,
    lang: Language
  ): Promise<Paged<TopProductDto>> => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const where = this.where(query);

    const [entities, total] = await Promise.all([
      this.model.findMany({
        where,
        select: {
          id: true,
          thumbnail: true,
          visible: true,
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
        orderBy: { createdAt: 'desc' }
      }),
      this.model.count({ where })
    ]);

    const items: TopProductDto[] = entities.map((t) => ({
      id: t.id,
      visible: t.visible,
      thumbnail: t.thumbnail,
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

  getById = async (id: string): Promise<TopProduct> => {
    const entity = await this.model.findUnique({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  };

  create = async (
    data: TopProductBody,
    file?: FileBuffer
  ): Promise<TopProduct> => {
    let thumbnail: string | undefined;
    try {
      const { productId, visible = false } = data;
      if (!file) throw new BadRequestException('Hãy tải ảnh lên');
      thumbnail = await cloudinary.upload(file);

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
          'Sản phẩm này đã nằm trong sản phẩm tiêu biểu.'
        );
      }

      const entity = await this.model.create({
        data: { productId, thumbnail, visible }
      });

      return entity;
    } catch (error) {
      cloudinary.cleanup(thumbnail);
      throw error;
    }
  };

  update = async (
    id: string,
    data: Partial<TopProductBody>,
    file?: FileBuffer
  ): Promise<TopProduct> => {
    let thumbnail: string | undefined;

    try {
      const { productId, visible } = data;

      const entity = await this.model.findUnique({
        where: { id },
        select: { productId: true, thumbnail: true }
      });
      if (!entity) throw new NotFoundException();

      const input: Prisma.TopProductUpdateInput = {};

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
            'Sản phẩm này đã nằm trong sản phẩm tiêu biểu.'
          );
        }

        input.product = { connect: { id: productId } };
      }

      if (visible !== undefined) input.visible = visible;

      if (file) {
        thumbnail = await cloudinary.upload(file);
        input.thumbnail = thumbnail;
      }

      await this.model.update({ where: { id }, data: input });

      if (file) {
        cloudinary.cleanup(entity.thumbnail);
      }

      const result = await this.model.findUnique({
        where: { id }
      });

      return result!;
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

      if (!entity) {
        throw new NotFoundException();
      }

      await this.model.delete({ where: { id } });

      if (entity.thumbnail) {
        cloudinary.cleanup(entity.thumbnail);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export default new TopProductService();
