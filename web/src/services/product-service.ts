import { cache } from 'react';
import { http } from '~/lib/http';
import type {
  Paginated,
  Product,
  ProductPin,
  ProductSummary,
  ProductTop
} from '~/types';

const productService = {
  get: cache(
    async (params?: {
      category?: string;
      sub?: boolean;
      page?: number;
      limit?: number;
    }): Promise<Paginated<ProductSummary>> => {
      try {
        const { data } = await http.get<Paginated<ProductSummary>>(
          '/products',
          { params }
        );
        return data;
      } catch {
        return {
          items: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
          }
        };
      }
    }
  ),
  getBySlug: cache(async (slug: string): Promise<Product | null> => {
    try {
      const { data } = await http.get<Product>(`/products/${slug}`);
      return data;
    } catch {
      return null;
    }
  }),
  getPinned: async (): Promise<ProductPin[]> => {
    try {
      const { data } = await http.get<ProductPin[]>('/products/pinned');
      return data;
    } catch {
      return [];
    }
  },
  getTop: async (): Promise<ProductTop[]> => {
    try {
      const { data } = await http.get<ProductTop[]>('/products/top');
      return data;
    } catch {
      return [];
    }
  }
};

export default productService;
