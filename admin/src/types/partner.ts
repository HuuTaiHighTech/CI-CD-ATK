import type z from 'zod';
import type { PartnerSchema } from '~/validators';

export type PartnerForm = z.infer<typeof PartnerSchema>;

export interface Partner {
   id: string;
   logo: string;
   name: string;
   url: string;
   visible: boolean;
   createdAt: string;
   updatedAt: string;
}
