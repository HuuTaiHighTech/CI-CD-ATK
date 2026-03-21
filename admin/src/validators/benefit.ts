import z from 'zod';
import { LanguageSchema } from '~/validators/common';

const I18nSchema = z.object({
   lang: LanguageSchema,
   title: z
      .string()
      .trim()
      .min(1, 'Tiêu đề không được để trống')
      .max(255, 'Tiêu đề tối đa 255 ký tự'),
   items: z.array(z.string()).nullable().optional()
});

export const BenefitSchema = z.object({
   id: z.string().optional(),
   i18n: z.array(I18nSchema).optional(),
   visible: z.boolean().default(false).optional()
});
