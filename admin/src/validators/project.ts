import z from 'zod';
import { LanguageSchema } from '~/validators/common';

const DetailSchema = z.object({
   key: z.string().trim().min(1, 'Tên không được bỏ trống'),
   value: z.string().trim().min(1, 'Giá trị không được bỏ trống')
});

const I18nSchema = z.object({
   lang: LanguageSchema,
   name: z
      .string()
      .trim()
      .min(1, 'Tên không được để trống')
      .max(255, 'Tên tối đa 255 ký tự'),
   details: z.array(DetailSchema).nullable().optional()
});

export const ProjectSchema = z.object({
   id: z.string().optional(),
   thumbnail: z.string().optional().nullable(),
   i18n: z.array(I18nSchema).optional(),
   visible: z.boolean().default(false).optional(),
   changed: z.boolean().default(false).optional()
});
