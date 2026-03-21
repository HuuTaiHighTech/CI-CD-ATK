import type z from 'zod';
import type { GroupSchema, LanguageSchema } from '~/validators';

export type Language = z.infer<typeof LanguageSchema>;
export type Group = z.infer<typeof GroupSchema>;

export interface Pagination {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
}

export interface Paginated<T> {
   items: T[];
   pagination: Pagination;
}

export interface QueryParams {
   page: number;
   limit: number;
   search: string;
   [key: string]: any;
}
