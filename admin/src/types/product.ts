import type z from 'zod';
import type { ProductSchema } from '~/validators';

export type ProductForm = z.infer<typeof ProductSchema>;

export interface ProductSelect {
   id: string;
   name: string;
}

export interface Product {
   id: string;
   images?: string[];
   name: string;
   slug: string;
   category?: {
      id: string;
      name: string;
      slug: string;
   };
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
