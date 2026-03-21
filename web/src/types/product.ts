import type { Tag } from '~/types/tag';

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  images: string[];
  summary: string;
}

export interface ProductTop {
  id: string;
  thumbnail: string;
  slug: string;
  name: string;
  summary: string;
}

export interface ProductPin {
  id: string;
  image: string;
  slug: string;
  name: string;
  summary: string;
}

export interface Product extends ProductSummary {
  description: string;
  category: { id: string; slug: string; name: string } | null;
  features: Array<{ key: string; value: string }>;
  tags: Tag[];
  createdAt: string;
}
