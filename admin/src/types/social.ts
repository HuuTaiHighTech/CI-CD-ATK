import type z from 'zod';
import type { SocialSchema } from '~/validators';

export type SocialForm = z.infer<typeof SocialSchema>;

export interface Social {
   id: string;
   icon: string;
   name: string;
   url: string;
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
