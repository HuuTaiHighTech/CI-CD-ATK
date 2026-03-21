import { cache } from 'react';
import { http } from '~/lib/http';
import type { Cursor, Search } from '~/types';

type Query = {
  type: string | undefined;
  q: string | undefined;
  cursor: string | undefined;
  limit: number;
};

const searchService = {
  get: cache(
    async ({
      type,
      q,
      cursor = undefined,
      limit = 10
    }: Query): Promise<Cursor<Search>> => {
      try {
        const { data } = await http.get<Cursor<Search>>('/search', {
          params: { type, q, cursor, limit }
        });
        return data;
      } catch {
        return {
          items: [],
          cursor: { hasMore: false, nextCursor: null }
        };
      }
    }
  )
};

export default searchService;
