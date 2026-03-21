import z from 'zod';

export const BannerSchema = z.object({
   id: z.string().optional(),
   images: z.array(z.string().nullable()).optional(),
   key: z.string().trim().min(1).max(255),
   name: z.string().max(255),
   changed: z.boolean().default(false).optional()
});
