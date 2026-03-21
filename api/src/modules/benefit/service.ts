import type { Benefit, Language, Prisma } from '@prisma/client';
import { prisma } from '~/config';
import { NotFoundException } from '~/exceptions';
import { BenefitBody, BenefitQuery } from '~/modules/benefit/schema';
import type { BenefitDto, Paged } from '~/types';
import { validate } from '~/utils';

class BenefitService {
   private model;

   constructor() {
      this.model = prisma.benefit;
   }

   private where = (query: BenefitQuery): Prisma.BenefitWhereInput => {
      const { search, visible } = query;

      const conditions: Prisma.BenefitWhereInput[] = [];

      const trimmed = search?.trim();
      if (trimmed) {
         const filter = { contains: trimmed, mode: 'insensitive' } as const;
         conditions.push({
            i18n: {
               some: { title: filter }
            }
         });
      }

      if (visible !== undefined) {
         conditions.push({ visible });
      }

      return conditions.length > 0 ? { AND: conditions } : {};
   };

   get = async (lang: Language): Promise<BenefitDto[]> => {
      const entities = await this.model.findMany({
         where: { visible: true },
         select: {
            id: true,
            i18n: {
               where: { lang },
               select: { title: true, items: true }
            }
         },
         orderBy: { createdAt: 'asc' }
      });

      return entities.map((entity) => {
         const i18n = entity?.i18n[0];
         return {
            id: entity.id,
            title: i18n?.title || '',
            items: i18n?.items || []
         };
      });
   };

   paginate = async (
      query: BenefitQuery,
      lang: Language
   ): Promise<Paged<BenefitDto>> => {
      const { page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;
      const where = this.where(query);

      const [entities, total] = await Promise.all([
         this.model.findMany({
            where,
            include: {
               i18n: {
                  where: { lang },
                  select: { title: true }
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
            title: i18n?.title || '',
            visible: entity.visible,
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

   getById = async (id: string): Promise<Benefit> => {
      const entity = await this.model.findUnique({
         where: { id },
         include: { i18n: { orderBy: { lang: 'asc' } } }
      });
      if (!entity) throw new NotFoundException();
      return entity;
   };

   create = async (data: BenefitBody): Promise<Benefit> => {
      try {
         const { i18n, visible = false } = data;
         const result = await prisma.$transaction(async (tx) => {
            validate.i18n(i18n);

            const entity = await tx.benefit.create({
               data: {
                  visible,
                  i18n: { create: i18n }
               }
            });

            return entity;
         });
         return result;
      } catch (error) {
         throw error;
      }
   };

   update = async (id: string, data: BenefitBody): Promise<Benefit> => {
      try {
         const { i18n = [], visible } = data;
         const result = await prisma.$transaction(async (tx) => {
            const entity = await tx.benefit.findUnique({
               where: { id },
               select: { id: true }
            });
            if (!entity) throw new NotFoundException();

            const input: Prisma.BenefitUpdateInput = {};

            if (visible !== undefined) input.visible = visible;

            await tx.benefit.update({ where: { id }, data: input });

            for (const item of i18n) {
               await tx.benefitI18n.upsert({
                  where: {
                     benefitId_lang: {
                        benefitId: id,
                        lang: item.lang
                     }
                  },
                  update: item,
                  create: { benefitId: id, ...item }
               });
            }

            return await tx.benefit.findUnique({
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
      await this.model.delete({ where: { id } });
      return true;
   };
}

export default new BenefitService();
