import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z
  .object({
    NODE_ENV: z.enum(['production', 'development', 'test']),
    PORT: z
      .number()
      .or(z.string())
      .pipe(z.coerce.number().positive().int().default(8080)),
    DATABASE_URL: z.string(),
    DATABASE_TEST_URL: z.string(),
  })
  .partial();

const requiredEnvVarsSchema = envVarsSchema.required({
  NODE_ENV: true,
  DATABASE_URL: true,
  DATABASE_TEST_URL: true,
});

const result = requiredEnvVarsSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(`Config validation error: ${result.error}`);
}

const envVars = result.data;

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  postgres: {
    url:
      envVars.NODE_ENV !== 'test'
        ? envVars.DATABASE_URL
        : envVars.DATABASE_TEST_URL,
  },
};
