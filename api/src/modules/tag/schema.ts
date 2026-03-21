import { z } from 'zod';
import { LangSchema, QuerySchema } from '~/schemas';

const I18n = z.object({
   lang: LangSchema,
   name: z.string().max(255)
});

export const TagSchema = z.object({
   i18n: z.array(I18n).length(2).optional(),
   hot: z.boolean().optional()
});

export const TagQuerySchema = QuerySchema.extend({
   hot: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type TagBody = z.infer<typeof TagSchema>;
export type TagQuery = z.infer<typeof TagQuerySchema>;
