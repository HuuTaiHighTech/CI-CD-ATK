import type { Role } from '@prisma/client';

export interface User {
   id: string;
   name: string | null;
   username: string;
   role: Role;
   active?: boolean;
   updatedAt?: Date;
   createdAt?: Date;
}
