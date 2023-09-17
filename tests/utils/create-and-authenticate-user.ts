import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { UsersRoutes } from '@/infra/http/controllers/routes/users-routes.enum'

export async function createAndAuthenticateUser(
  fastify: FastifyAdapter,
  isAdmin = false,
) {
  await request(fastify.server)
    .post(UsersRoutes.USERS)
    .send({
      name: 'John Doe',
      email: 'johm@doe.com',
      password: '123456',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    })

  const sessionResponse = await request(fastify.server)
    .post(UsersRoutes.SESSIONS)
    .send({
      email: 'johm@doe.com',
      password: '123456',
    })
  const { token } = sessionResponse.body
  return {
    token,
  }
}
