export interface Paged<T> {
   items: T[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
}

export interface Cursor<T> {
   items: T[];
   pagination: {
      nextCursor: string | null;
      hasMore: boolean;
   };
}
