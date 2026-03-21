import type z from 'zod';
import type { Group } from '~/types/common';
import type { PostSchema } from '~/validators';

export type PostForm = z.infer<typeof PostSchema>;

export interface Post {
   id: string;
   thumbnail: string;
   slug: string;
   title: string;
   group: Group;
   category?: {
      id: string;
      name: string;
      slug: string;
   };
   hot: boolean;
   published: boolean;
   createdAt: string;
   updatedAt: string;
}
