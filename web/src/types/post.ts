import { Tag } from '~/types/tag';

export interface PostSummary {
  id: string;
  thumbnail: string;
  slug: string;
  title: string;
  summary: string;
  createdAt: string;
}

export interface Post extends PostSummary {
  group: string;
  content: string;
  tags: Tag[];
  updatedAt: string;
}
