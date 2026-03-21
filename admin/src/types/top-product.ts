import type z from 'zod';
import type { TopProductSchema } from '~/validators';

export type TopProductForm = z.infer<typeof TopProductSchema>;

export interface TopProduct {
   id: string;
   thumbnail: string;
   slug: string;
   name: string;
   visible: boolean;
   updatedAt: string;
   createdAt: string;
}
