import type { Prisma } from '@prisma/client';

export interface CategoryDto {
   id: string;
   order?: number;
   image?: string | null;
   name: string;
   slug: string;
   description?: Prisma.JsonValue | null;
   parentId: string | null;
   visible?: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface ChildrenWithProducts {
   id: string;
   image?: string | null;
   name: string;
   slug: string;
   products: {
      id: string;
      images: Prisma.JsonValue;
      name: string;
      slug: string;
      summary: string | null;
   }[];
}
