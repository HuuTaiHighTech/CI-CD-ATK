import { type FastifyInstance } from 'fastify';
import z from 'zod';
import { env, sheets } from '~/config';

const contactSchema = z.object({
  name: z.string().min(5),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/),
  email: z.email(),
  product: z.string().optional(),
  need: z.string(),
  others: z.string().optional()
});

async function sheetRoutes(route: FastifyInstance) {
  route.post(
    '/',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
          errorResponseBuilder: () => ({
            statusCode: 429,
            error: 'Too Many Requests',
            message: 'Bạn gửi form quá nhanh, vui lòng thử lại sau 1 phút.'
          })
        }
      }
    },
    async (req, rep) => {
      try {
        const data = contactSchema.parse(req.body);

        const values = [
          [
            data.name,
            data.phone,
            data.email,
            data.product || '-',
            data.need,
            data.others
          ]
        ];
        await sheets.spreadsheets.values.append({
          spreadsheetId: env.GOOGLE_SHEET_ID,
          range: 'Contact!A:F',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values }
        });
        rep.json(200, 'OK');
      } catch (error) {
        throw error;
      }
    }
  );
}

export default sheetRoutes;
