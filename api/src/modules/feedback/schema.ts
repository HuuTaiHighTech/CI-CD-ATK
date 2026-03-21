import z from 'zod';
import { LangSchema, QuerySchema } from '~/schemas';

const I18n = z.object({
   lang: LangSchema,
   name: z.string().max(100),
   position: z.string().max(100),
   content: z.string().max(255)
});

export const FeedbackSchema = z.object({
   star: z.coerce.number().int().min(0).max(5).optional(),
   i18n: z.array(I18n).optional(),
   visible: z.boolean().optional()
});

export const FeedbackQuerySchema = QuerySchema.extend({
   star: z.coerce.number().int().min(0).max(5).optional(),
   visible: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type FeedbackBody = z.infer<typeof FeedbackSchema>;
export type FeedbackQuery = z.infer<typeof FeedbackQuerySchema>;
