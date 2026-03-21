import z from 'zod';
import { RoleSchema } from '~/validators/common';

const NameSchema = z
   .string()
   .trim()
   .min(1, 'Tên không được để trống')
   .max(255, 'Tên quá dài')
   .regex(/^[\p{L}\s]+$/u, 'Chỉ được chữ cái và khoảng trắng');

const UsernameSchema = z
   .string()
   .toLowerCase()
   .trim()
   .min(3, 'Tên đăng nhập ít nhất 3 ký tự.')
   .max(100, 'Tên đăng nhập không quá 100 ký tự.')
   .regex(
      /^[a-z0-9]+([._-][a-z0-9]+)*$/,
      'Chỉ dùng chữ thường, số và dấu . _ - (không ở đầu/cuối).'
   )
   .refine(
      (val) => !/[<>'"\\/\s]/.test(val),
      'Không được chứa ký tự đặc biệt hoặc khoảng trắng.'
   );

const PasswordSchema = z
   .string()
   .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
   .max(50, 'Mật khẩu không được quá 50 ký tự')
   .refine((val) => /[a-z]/.test(val), 'Phải có ít nhất 1 chữ thường')
   .refine((val) => /[A-Z]/.test(val), 'Phải có ít nhất 1 chữ hoa')
   .refine((val) => /\d/.test(val), 'Phải có ít nhất 1 chữ số')
   .refine(
      (val) => /[^A-Za-z0-9]/.test(val),
      'Phải có ít nhất 1 ký tự đặc biệt'
   )
   .refine((val) => !/\s/.test(val), 'Không được chứa khoảng trắng');

export const ProfileSchema = z.object({
   name: NameSchema,
   username: UsernameSchema
});

export const UpdatePasswordSchema = z
   .object({
      currentPassword: z
         .string()
         .min(1, 'Nhập mật khẩu hiện tại')
         .nonempty('Nhập mật khẩu hiện tại'),
      newPassword: PasswordSchema,
      confirm: z.string()
   })
   .refine((data) => data.newPassword === data.confirm, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirm']
   })
   .refine((data) => data.newPassword !== data.currentPassword, {
      message: 'Mật khẩu mới không được trùng mật khẩu cũ',
      path: ['new']
   });

export const UserSchema = z
   .object({
      mode: z.enum(['create', 'update']),
      name: NameSchema,
      username: UsernameSchema,
      password: PasswordSchema.optional().nullable().or(z.literal('')),
      role: RoleSchema,
      active: z.boolean()
   })
   .superRefine((data, ctx) => {
      if (data.mode === 'create') {
         if (!data.password || data.password.trim() === '') {
            ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: 'Mật khẩu là bắt buộc khi thêm người dùng mới',
               path: ['password']
            });
         }
      }
   });
