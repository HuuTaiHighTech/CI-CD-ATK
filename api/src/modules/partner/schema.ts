import z from 'zod';

export const PartnerSchema = z.object({
   order: z.coerce.number().int().min(0).optional(),
   name: z.string().max(255),
   url: z.url().max(255),
   visible: z.boolean().optional()
});

export type PartnerBody = z.infer<typeof PartnerSchema>;
