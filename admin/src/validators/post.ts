import z from 'zod';
import { GroupSchema, LanguageSchema } from '~/validators/common';

const I18nSchema = z.object({
   lang: LanguageSchema,
   title: z
      .string()
      .trim()
      .min(1, 'Tiêu đề không được để trống')
      .max(255, 'Tiêu đề tối đa 255 ký tự'),
   summary: z
      .string()
      .max(255, 'Bản tóm tắt tối đa 255 ký tự')
      .nullable()
      .optional(),
   content: z
      .string()
      .max(50000, 'Nội dung tối đa 50000 ký tự')
      .nullable()
      .optional()
});

export const PostSchema = z.object({
   id: z.string().optional(),
   categoryId: z.string().nullable().optional(),
   group: GroupSchema,
   relate: z.array(GroupSchema).optional(),
   thumbnail: z.string().optional().nullable(),
   i18n: z.array(I18nSchema).optional(),
   published: z.boolean().default(false).optional(),
   tags: z.array(z.string()).optional(),
   hot: z.boolean().default(false).optional(),
   changed: z.boolean().default(false).optional()
});
