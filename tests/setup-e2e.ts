import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { makePrismaClient } from '@/infra/connection/prisma'
import { env } from '@/env'

const prismaInstance = makePrismaClient()

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
  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prismaInstance.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
  )
  await prismaInstance.$disconnect()
})
