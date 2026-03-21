import z from 'zod';
import { PasswordSchema, UsernameSchema } from '~/schemas/common';

export const SignInSchema = z.object({
   username: z.string().trim().min(1),
   password: z.string().trim().min(1)
});

export const ProfileSchema = z
   .object({
      name: z
         .string()
         .trim()
         .min(1)
         .max(255)
         .regex(/^[\p{L}\s]+$/u)
         .optional(),
      username: UsernameSchema.optional(),
      currentPassword: z.string().trim().min(1).optional(),
      newPassword: PasswordSchema.optional()
   })
   .refine((data) => {
      if (data.newPassword && !data.currentPassword) {
         return false;
      }
      return true;
   });

export type ProfileBody = z.infer<typeof ProfileSchema>;
