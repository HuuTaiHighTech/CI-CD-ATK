import { z } from 'zod';

const envSchema = z.object({
  APP_NAME: z.string().default('An Thái Khang JSC'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_GA_ID: z.string().optional()
});

const env = envSchema.parse(process.env);

export default env;
