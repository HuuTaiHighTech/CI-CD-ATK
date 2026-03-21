import z from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('AnThaiKhang'),
  VITE_NODE_ENV: z.enum(['development', 'production', 'test']),
  VITE_AUTH_KEY: z.string().default('current-user'),
  VITE_API_URL: z.url().default('http://localhost:3000/api')
});

const env = envSchema.parse(import.meta.env);

export const APP_NAME = env.VITE_APP_NAME;
export const NODE_ENV = env.VITE_NODE_ENV;
export const AUTH_KEY = env.VITE_AUTH_KEY;
export const API_URL = env.VITE_API_URL.replace(/\/+$/, '');

export default env;
