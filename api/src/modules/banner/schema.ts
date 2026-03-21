import { z } from 'zod';

export const BannerSchema = z.object({
   key: z.string().trim().min(1).max(255),
   name: z.string().max(255),
   images: z.array(z.string().nullable()).optional()
});

export type BannerBody = z.infer<typeof BannerSchema>;
