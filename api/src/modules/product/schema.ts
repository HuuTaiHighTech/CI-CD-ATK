import { z } from 'zod';
import { LangSchema, QuerySchema } from '~/schemas';

const Feature = z.object({
   key: z.string().trim().max(255),
   value: z.string().trim().max(255)
});

const I18n = z.object({
   lang: LangSchema,
   name: z.string().max(255),
   summary: z
      .string()
      .max(255)
      .nullable()
      .transform((v) => v ?? undefined)
      .optional(),
   description: z
      .string()
      .max(50000)
      .nullable()
      .transform((v) => v ?? undefined)
      .optional(),
   features: z
      .array(Feature)
      .nullable()
      .transform((v) => v ?? undefined)
      .optional()
});

export const ProductSchema = z.object({
   categoryId: z.cuid2().nullable().optional(),
   i18n: z.array(I18n).length(2).optional(),
   tags: z.array(z.cuid2()).optional(),
   images: z.array(z.string().nullable()).optional(),
   visible: z.boolean().optional()
});

export const ProductQuerySchema = QuerySchema.extend({
   category: z.string().nullable().optional(),
   visible: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional()),
   sub: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type ProductBody = z.infer<typeof ProductSchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;
