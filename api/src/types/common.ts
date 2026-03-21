import z from 'zod';
import { QuerySchema } from '~/schemas';

export type Query = z.infer<typeof QuerySchema>;
