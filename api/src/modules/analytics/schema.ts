import z from 'zod';

const today = () =>
  new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });

const DateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');

export const AnalyticsQuerySchema = z.object({
  startDate: DateOnlySchema.optional().default(today()),
  endDate: DateOnlySchema.optional().default(today()),
  limit: z.coerce.number().int().min(1).max(100).catch(5).default(5)
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
