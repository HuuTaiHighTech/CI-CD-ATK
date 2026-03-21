import z from 'zod';
import { LanguageSchema } from '~/validators/common';

const I18nSchema = z.object({
   lang: LanguageSchema,
   name: z
      .string()
      .trim()
      .min(1, 'Tên không được để trống')
      .max(255, 'Tên tối đa 255 ký tự'),
   description: z
      .string()
      .max(50000, 'Nội dung tối đa 50000 ký tự')
      .nullable()
      .optional()
});

export const CategorySchema = z.object({
   id: z.string().optional(),
   image: z.string().optional().nullable(),
   i18n: z.array(I18nSchema).optional(),
   parentId: z.string().nullable().optional(),
   visible: z.boolean().default(false).optional(),
   changed: z.boolean().default(false).optional()
});
