import z from 'zod';

export const SocialSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, 'Tên không được để trống')
      .max(255, 'Tên tối đa 255 ký tự'),
   url: z.url('Đường dẫn không hợp lệ').max(255, 'Đường dẫn tối đa 255 ký tự'),
   visible: z.boolean().optional(),
   icon: z.string().optional().nullable(),
   changed: z.boolean().default(false).optional()
});
