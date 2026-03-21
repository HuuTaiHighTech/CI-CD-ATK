import { cache } from 'react';
import { http } from '~/lib/http';
import type { Tag } from '~/types';

const tagService = {
  getHot: cache(async (): Promise<Tag[]> => {
    try {
      const { data } = await http.get<Tag[]>('/tags/hot');
      return data;
    } catch {
      return [];
    }
  }),
  getBySlug: cache(async (slug: string): Promise<Tag | null> => {
    try {
      const { data } = await http.get<Tag>(`/tags/${slug}`);
      return data;
    } catch {
      return null;
    }
  })
};

export default tagService;
