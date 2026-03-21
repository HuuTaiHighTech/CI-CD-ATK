import z from 'zod';

export const QuerySchema = z.object({
   type: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.enum(['product', 'insight', 'activity']))
      .optional(),
   q: z
      .string()
      .trim()
      .transform((val) => val.replace(/\s+/g, ' '))
      .optional(),
   cursor: z.string().optional(),
   limit: z.coerce.number().int().min(1).max(100).catch(10).default(10)
});

export type Query = z.infer<typeof QuerySchema>;
