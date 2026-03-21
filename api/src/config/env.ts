import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ALLOWED_ORIGINS: z.string().transform((val) =>
    val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  ),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET is required'),
  COOKIE_NAME: z.string().default('sid'),
  COOKIE_MAX_AGE: z.coerce.number().default(1800000),
  GA_PROPERTY_ID: z.string().optional(),
  GOOGLE_SHEET_ID: z.string(),
  GOOGLE_SERVICE_ACCOUNT: z.string().transform((val) => JSON.parse(val))
});

const env = envSchema.parse(process.env);

export default env;
