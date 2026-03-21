import { Prisma } from '@prisma/client';

export interface ProductDto {
   id: string;
   images: Prisma.JsonValue;
   name: string;
   slug: string;
   summary?: string;
   description?: Prisma.JsonValue | null;
   features?: Prisma.JsonValue | null;
   category?: {
      id: string;
      name: string;
      slug: string;
   };
   tags?: {
      name: string;
      slug: string;
   }[];
   visible?: boolean;
   createdAt: Date;
   updatedAt?: Date;
}

export interface ProductSummary {
   id: string;
   thumbnail?: string;
   image?: string;
   slug?: string;
   name: string;
   summary?: string;
}
