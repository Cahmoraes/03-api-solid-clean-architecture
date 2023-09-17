import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { createAndAuthenticateUser } from './utils/create-and-authenticate-user'
import { provideDependencies } from './utils/provide-dependencies'
import { FastifyHttpController } from '@/infra/http/controllers/fastify-http-controller'

describe('Get User Profile (e2e)', () => {
  let fastify: FastifyAdapter
  beforeAll(async () => {
    provideDependencies()
    const port = await getPort()
    fastify = new FastifyAdapter({ port })
    new FastifyHttpController(fastify)
    await fastify.listen()
  })

  afterAll(async () => {
    await fastify.close()
  })

  it('should be able to authenticate an user', async () => {
    const { token } = await createAndAuthenticateUser(fastify)
    const profileResponse = await request(fastify.server)
      .get(Routes.ME)
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.body).toMatchObject({
      id: expect.any(String),
      name: 'John Doe',
      email: 'johm@doe.com',
      createdAt: expect.any(String),
    })
  })
})
