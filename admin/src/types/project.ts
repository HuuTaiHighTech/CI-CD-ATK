import type z from 'zod';
import type { ProjectSchema } from '~/validators';

export type ProjectForm = z.infer<typeof ProjectSchema>;

export interface Project {
   id: string;
   thumbnail?: string;
   name: string;
   details: {
      key: string;
      value: string;
   }[];
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
