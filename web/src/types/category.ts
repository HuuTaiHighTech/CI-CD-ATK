import type { ProductSummary } from '~/types/product';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: null;
}

export interface CategoryTree extends Category {
  products: ProductSummary[];
}
