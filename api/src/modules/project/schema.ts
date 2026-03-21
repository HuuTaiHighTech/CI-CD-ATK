import { z } from 'zod';
import { LangSchema, QuerySchema } from '~/schemas';

const Details = z.object({
   key: z.string().trim().max(255),
   value: z.string().trim().max(255)
});

const I18n = z.object({
   lang: LangSchema,
   name: z.string().max(255),
   details: z
      .array(Details)
      .nullable()
      .transform((v) => v ?? undefined)
      .optional()
});

export const ProjectSchema = z.object({
   i18n: z.array(I18n).length(2).optional(),
   visible: z.boolean().optional()
});

export const ProjectQuerySchema = QuerySchema.extend({
   visible: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type ProjectBody = z.infer<typeof ProjectSchema>;
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;
