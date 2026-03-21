import { type Prisma } from '@prisma/client';

export interface ProjectDto {
   id: string;
   thumbnail: string;
   name: string;
   details?: Prisma.JsonValue | null;
   visible?: boolean;
   createdAt: Date;
   updatedAt?: Date;
}
