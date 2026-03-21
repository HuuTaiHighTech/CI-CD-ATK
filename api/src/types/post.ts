import type { Group, Prisma } from '@prisma/client';

export interface PostDto {
   id: string;
   thumbnail: string | null;
   authorName?: string;
   title: string;
   slug: string;
   summary: string | null;
   content?: Prisma.JsonValue | null;
   group: Group;
   category?: {
      id: string;
      name: string;
      slug: string;
   };
   tags?: {
      name: string;
      slug: string;
   }[];
   hot: boolean;
   published?: boolean;
   updatedAt: Date;
   createdAt: Date;
}
