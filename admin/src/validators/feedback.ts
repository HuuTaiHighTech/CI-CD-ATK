import z from 'zod';
import { LanguageSchema } from '~/validators/common';

const I18nSchema = z.object({
   lang: LanguageSchema,
   name: z
      .string()
      .trim()
      .min(1, 'Tên không được để trống')
      .max(100, 'Tên tối đa 100 ký tự'),
   position: z
      .string()
      .trim()
      .min(1, 'Vị trí không được để trống')
      .max(100, 'Vị trí tối đa 100 ký tự'),
   content: z
      .string()
      .trim()
      .min(1, 'Nội dung không được để trống')
      .max(255, 'Nội dung tối đa 255 ký tự')
});

export const FeedbackSchema = z.object({
   star: z
      .number('Số sao không hợp lệ')
      .int('Số sao phải là số nguyên')
      .min(0, 'Số sao phải lớn hơn 0')
      .max(5, 'Số sao phải bé hơn 5'),
   avatar: z.string().optional().nullable(),
   i18n: z.array(I18nSchema).optional(),
   visible: z.boolean().optional(),
   changed: z.boolean().default(false).optional()
});
