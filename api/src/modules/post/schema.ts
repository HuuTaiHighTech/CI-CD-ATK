import { z } from 'zod';
import { LangSchema, QuerySchema, GroupSchema } from '~/schemas';

const I18n = z.object({
  lang: LangSchema,
  title: z.string().max(255),
  summary: z
    .string()
    .max(255)
    .nullable()
    .transform((v) => v ?? undefined)
    .optional(),
  content: z
    .string()
    .max(50000)
    .nullable()
    .transform((v) => v ?? undefined)
    .optional()
});

export const PostSchema = z.object({
  categoryId: z.cuid2().nullable().optional(),
  group: GroupSchema,
  relate: z.array(GroupSchema).optional(),
  tags: z.array(z.cuid2()).optional(),
  i18n: z.array(I18n).length(2).optional(),
  hot: z.boolean().optional(),
  published: z.boolean().optional()
});

export const PostQuerySchema = QuerySchema.extend({
  category: z.string().nullable().optional(),
  tags: z
    .preprocess((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : [val];
    }, z.array(z.string()))
    .optional(),
  group: GroupSchema.optional(),
  relate: z
    .preprocess((val) => {
      if (!val) return undefined;
      return Array.isArray(val) ? val : [val];
    }, z.array(GroupSchema))
    .optional(),
  published: z.preprocess((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }, z.boolean().optional()),
  hot: z.preprocess((value) => {
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

export type PostBody = z.infer<typeof PostSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;
