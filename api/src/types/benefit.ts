import { type Prisma } from '@prisma/client';

export interface BenefitDto {
   id: string;
   title: string;
   items?: Prisma.JsonValue | null;
   visible?: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}
