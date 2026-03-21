import { z } from 'zod';
import { LangSchema, QuerySchema } from '~/schemas';

const I18n = z.object({
   lang: LangSchema,
   title: z.string().max(255),
   items: z
      .array(z.string())
      .nullable()
      .optional()
      .transform((val) => {
         if (!val) return undefined;
         const filtered = val.map((s) => s.trim()).filter((s) => s.length > 0);
         return filtered.length > 0 ? filtered : undefined;
      })
});

export const BenefitSchema = z.object({
   i18n: z.array(I18n).length(2).optional(),
   visible: z.boolean().optional()
});

export const BenefitQuerySchema = QuerySchema.extend({
   visible: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type BenefitBody = z.infer<typeof BenefitSchema>;
export type BenefitQuery = z.infer<typeof BenefitQuerySchema>;
