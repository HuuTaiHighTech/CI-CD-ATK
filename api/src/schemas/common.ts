import z from 'zod';
import { Language, Role, Group } from '@prisma/client';

export const UsernameSchema = z
   .string()
   .toLowerCase()
   .trim()
   .nonempty()
   .max(100)
   .regex(/^[a-z0-9]+([._-][a-z0-9]+)*$/i)
   .refine((val) => /^[a-zA-Z0-9]/.test(val))
   .refine((val) => /[a-zA-Z0-9]$/.test(val))
   .refine((val) => !/[<>'"\\\/\s]/.test(val));

export const PasswordSchema = z
   .string()
   .trim()
   .max(50)
   .nonempty()
   .regex(/[a-z]/)
   .regex(/[A-Z]/)
   .regex(/[0-9]/)
   .regex(/[^A-Za-z0-9]/)
   .refine((s) => !/\s/.test(s));

export const LangSchema = z
   .string()
   .trim()
   .toUpperCase()
   .pipe(z.enum(Language));

export const GroupSchema = z.string().trim().toUpperCase().pipe(z.enum(Group));

export const RoleSchema = z.string().trim().toUpperCase().pipe(z.enum(Role));

export const QuerySchema = z.object({
   page: z.coerce.number().int().min(1).catch(1).default(1),
   limit: z.coerce.number().int().min(1).max(100).catch(10).default(10),
   search: z
      .string()
      .trim()
      .transform((val) => val.replace(/\s+/g, ' '))
      .optional()
});
