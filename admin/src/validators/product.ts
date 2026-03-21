import z from 'zod';
import { LanguageSchema } from '~/validators/common';

const FeatureSchema = z.object({
   key: z.string().trim().min(1, 'Tên tính năng không được bỏ trống'),
   value: z.string().trim().min(1, 'Giá trị không được bỏ trống')
});

const I18nSchema = z.object({
   lang: LanguageSchema,
   name: z
      .string()
      .trim()
      .min(1, 'Tên không được để trống')
      .max(255, 'Tên tối đa 255 ký tự'),
   summary: z
      .string()
      .max(255, 'Bản tóm tắt tối đa 255 ký tự')
      .nullable()
      .optional(),
   description: z
      .string()
      .max(50000, 'Mô tả tối đa 50000 ký tự')
      .nullable()
      .optional(),
   features: z.array(FeatureSchema).nullable().optional()
});

export const ProductSchema = z.object({
   id: z.string().optional(),
   categoryId: z.string().nullable().optional(),
   i18n: z.array(I18nSchema).optional(),
   images: z.array(z.string().nullable()).optional(),
   visible: z.boolean().default(false).optional(),
   tags: z.array(z.string()).optional(),
   changed: z.boolean().default(false).optional()
});
