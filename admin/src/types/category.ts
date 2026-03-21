import type z from 'zod';
import type { CategorySchema } from '~/validators';

export type CategoryForm = z.infer<typeof CategorySchema>;

export type CategorySelect = {
   id: string;
   name: string;
   slug: string;
   parentId?: string | null;
};

export interface Category {
   id: string;
   image: string;
   name: string;
   slug: string;
   description?: string;
   parentId?: string;
   featured: boolean;
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
