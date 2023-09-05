import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const makePrismaClient = (DATABASE_URL = env.DATABASE_URL) => {
  return new PrismaClient({
    datasourceUrl: DATABASE_URL,
  })
}
