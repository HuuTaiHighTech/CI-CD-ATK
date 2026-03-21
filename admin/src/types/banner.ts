import type z from 'zod';
import type { BannerSchema } from '~/validators';

export type BannerForm = z.infer<typeof BannerSchema>;

export interface Banner {
   id: string;
   images?: string[];
   key: string;
   name: string;
   createdAt: string;
   updatedAt: string;
}
