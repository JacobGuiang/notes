import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { CookieOptions } from 'express';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z
  .object({
    NODE_ENV: z.enum(['production', 'development', 'test']),
    PORT: z.number().or(z.string()).pipe(z.coerce.number().positive().int()),
    DATABASE_URL: z.string(),
    DATABASE_TEST_URL: z.string(),
    COOKIE_SECRET: z.string(),
    JWT_SECRET: z.string(),
  })
  .partial();

const requiredEnvVarsSchema = envVarsSchema.required({
  NODE_ENV: true,
  ...(process.env.NODE_ENV === 'production' && { DATABASE_URL: true }),
  ...(process.env.NODE_ENV !== 'production' && { DATABASE_TEST_URL: true }),
  COOKIE_SECRET: true,
  JWT_SECRET: true,
});

const result = requiredEnvVarsSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`Config validation error: ${result.error}`);
}

const envVars = result.data;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: 'strict',
};

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT || 8080,
  postgres: {
    url:
      envVars.NODE_ENV === 'production'
        ? envVars.DATABASE_URL
        : envVars.DATABASE_TEST_URL,
  },
  cookieSecret: envVars.COOKIE_SECRET,
  jwtSecret: envVars.JWT_SECRET,
  cookieOptions,
};
