import { type Prisma } from '@prisma/client';

function toStringArray(json: Prisma.JsonValue | null | undefined): string[] {
   if (!json) return [];
   return Array.isArray(json) ? json.filter((i) => typeof i === 'string') : [];
}

export default toStringArray;
