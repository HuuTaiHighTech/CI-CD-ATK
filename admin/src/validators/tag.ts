import z from 'zod';
import { LanguageSchema } from '~/validators/common';

const I18nSchema = z.object({
   lang: LanguageSchema,
   name: z
      .string()
      .trim()
      .min(1, 'Tên không được để trống')
      .max(255, 'Tên tối đa 255 ký tự')
});

export const TagSchema = z.object({
   i18n: z.array(I18nSchema).optional(),
   hot: z.boolean().default(false).optional()
});
