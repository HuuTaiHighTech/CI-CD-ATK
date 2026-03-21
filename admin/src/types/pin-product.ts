import type z from 'zod';
import type { PinProductSchema } from '~/validators';

export type PinProductForm = z.infer<typeof PinProductSchema>;

export interface PinProduct {
   id: string;
   image: string;
   slug: string;
   name: string;
   updatedAt: string;
   createdAt: string;
}
