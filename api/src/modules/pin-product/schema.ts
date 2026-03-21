import z from 'zod';

export const PinProductSchema = z.object({
   productId: z.string()
});

export type PinProductBody = z.infer<typeof PinProductSchema>;
