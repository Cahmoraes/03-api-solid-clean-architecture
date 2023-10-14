import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { makePrismaClient } from '@/infra/connection/prisma'
import { env } from '@/env'
import { Redis } from 'ioredis'

const prismaInstance = makePrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  password: env.REDIS_PASSWORD,
})

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()
beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  env.DATABASE_URL = databaseURL
  process.env.REDIS_DB = '1'
  env.REDIS_DB = 1
  await redis.flushdb()
  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prismaInstance.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  )
  await prismaInstance.$disconnect()
})
