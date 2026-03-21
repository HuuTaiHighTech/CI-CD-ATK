import z from 'zod';

export const PinProductSchema = z.object({
   id: z.string().optional(),
   productId: z.string().nullable().optional(),
   image: z.string().optional().nullable(),
   changed: z.boolean().default(false).optional()
});
