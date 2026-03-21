import { z } from 'zod';

export const sheetSchema = z.object({
  name: z.string().min(5),
  phone: z.string().min(8).max(15),
  email: z.email(),
  need: z.string().min(3),
  product: z.string().optional(),
  others: z.string().optional()
});

export type Sheet = z.infer<typeof sheetSchema>;
