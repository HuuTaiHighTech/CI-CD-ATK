import z from 'zod';

export const TopProductSchema = z.object({
   id: z.string().optional(),
   productId: z.string().nullable().optional(),
   thumbnail: z.string().optional().nullable(),
   visible: z.boolean().default(false).optional(),
   changed: z.boolean().default(false).optional()
});
