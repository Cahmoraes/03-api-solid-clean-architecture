import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { createAndAuthenticateUser } from './create-and-authenticate-user'

export async function createAndAuthenticateAdmin(fastify: FastifyAdapter) {
  return createAndAuthenticateUser(fastify, true)
}
