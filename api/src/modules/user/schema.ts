import z from 'zod';
import {
   PasswordSchema,
   QuerySchema,
   RoleSchema,
   UsernameSchema
} from '~/schemas';

export const UserSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1)
      .max(255)
      .regex(/^[\p{L}\s]+$/u),
   username: UsernameSchema,
   password: PasswordSchema,
   role: RoleSchema.optional(),
   active: z.boolean().optional()
});

export const UserQuerySchema = QuerySchema.extend({
   role: RoleSchema.optional(),
   active: z.preprocess((value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
   }, z.boolean().optional())
});

export type UserBody = z.infer<typeof UserSchema>;
export type UserQuey = z.infer<typeof UserQuerySchema>;
