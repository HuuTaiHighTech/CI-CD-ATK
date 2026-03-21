export interface Search {
  type: 'product' | 'post';
  id: string;
  image: string | null;
  slug: string;
  name: string;
  createdAt: string;
}
