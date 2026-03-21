import z from 'zod';
import { QuerySchema } from '~/schemas';

export const TopProductSchema = z.object({
   productId: z.string(),
   visible: z.boolean().optional()
});

export const TopProductQuerySchema = QuerySchema.extend({
   visible: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type TopProductBody = z.infer<typeof TopProductSchema>;
export type TopProductQuery = z.infer<typeof TopProductQuerySchema>;
