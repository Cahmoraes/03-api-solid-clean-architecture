import request from 'supertest'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'

export async function createAndAuthenticateUser(
  fastify: FastifyAdapter,
  isAdmin = false,
) {
  await request(fastify.server)
    .post(Routes.USERS)
    .send({
      name: 'John Doe',
      email: 'johm@doe.com',
      password: '123456',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    })

  const sessionResponse = await request(fastify.server)
    .post(Routes.SESSIONS)
    .send({
      email: 'johm@doe.com',
      password: '123456',
    })
  const { token } = sessionResponse.body
  return {
    token,
  }
}
