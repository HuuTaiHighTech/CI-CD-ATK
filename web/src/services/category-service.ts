import { cache } from 'react';
import { http } from '~/lib/http';
import type { Category, CategoryTree } from '~/types';

const categoryService = {
  get: cache(async (): Promise<Category[]> => {
    try {
      const { data } = await http.get<Category[]>('/categories/parent');
      return data;
    } catch {
      return [];
    }
  }),
  getTree: cache(async (slug?: string): Promise<CategoryTree[]> => {
    try {
      if (!slug) return [];
      const { data } = await http.get<CategoryTree[]>(
        `/categories/${slug}/tree`
      );
      return data;
    } catch {
      return [];
    }
  })
};

export default categoryService;
