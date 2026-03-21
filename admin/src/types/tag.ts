import type z from 'zod';
import type { TagSchema } from '~/validators';

export type TagForm = z.infer<typeof TagSchema>;

export interface Tag {
   id: string;
   name: string;
   slug: string;
   hot: boolean;
   createdAt: string;
   updatedAt: string;
}
