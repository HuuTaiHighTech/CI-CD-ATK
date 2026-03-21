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

export interface Cursor<T> {
  items: T[];
  cursor: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}
