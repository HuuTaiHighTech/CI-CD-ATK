import type z from 'zod';
import type { FeedbackSchema } from '~/validators';

export type FeedbackForm = z.infer<typeof FeedbackSchema>;

export interface Feedback {
   id: string;
   star: number;
   avatar: string;
   name: string;
   position: string;
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
