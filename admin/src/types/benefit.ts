import type z from 'zod';
import type { BenefitSchema } from '~/validators';

export type BenefitForm = z.infer<typeof BenefitSchema>;

export interface Benefit {
   id: string;
   title: string;
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
