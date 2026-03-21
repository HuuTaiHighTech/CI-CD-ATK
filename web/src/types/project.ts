export interface Project {
  id: string;
  thumbnail: string;
  name: string;
  details: Array<{ key: string; value: string }>;
  createdAt: string;
}
