import { z } from 'zod';
import { LangSchema, QuerySchema } from '~/schemas';

const I18n = z.object({
   lang: LangSchema,
   name: z.string().max(255),
   description: z
      .string()
      .max(50000)
      .nullable()
      .transform((v) => v ?? undefined)
      .optional()
});

export const CategorySchema = z.object({
   parentId: z.cuid2().nullable().optional(),
   i18n: z.array(I18n).optional(),
   visible: z.boolean().optional()
});

export const CategoryQuerySchema = QuerySchema.extend({
   visible: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type CategoryBody = z.infer<typeof CategorySchema>;
export type CategoryQuery = z.infer<typeof CategoryQuerySchema>;
