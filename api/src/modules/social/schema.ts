import z from 'zod';

export const SocialSchema = z.object({
   name: z.string().max(255),
   url: z.url().max(255),
   visible: z.boolean().optional()
});

export type SocialBody = z.infer<typeof SocialSchema>;
