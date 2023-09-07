import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('test'),
  HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string().default('SECRET_PASSWORD'),
  DATABASE_URL: z.string().url(),
})

const _env = envSchema.safeParse(process.env)

/* c8 ignore start */
if (!_env.success) {
  console.error(`❌ Invalid environment variables: ${_env.error.format()}`)
  throw new Error(`❌ Invalid environment variables: ${_env.error.format()}`)
}

export const env = _env.data
export const isProduction = () => env.NODE_ENV === 'production'
export const isDevelopment = () => env.NODE_ENV === 'dev'
export const isTest = () => env.NODE_ENV === 'test'
