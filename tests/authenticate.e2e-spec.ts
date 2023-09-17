import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { provideDependencies } from './utils/provide-dependencies'
import { FastifyHttpController } from '@/infra/http/controllers/fastify-http-controller'
import { UsersRoutes } from '@/infra/http/controllers/routes/users-routes.enum'

describe('Authenticate (e2e)', () => {
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

  it.only('should be able to authenticate an user', async () => {
    await request(fastify.server).post(UsersRoutes.USERS).send({
      name: 'John Doe',
      email: 'johm@doe.com',
      password: '123456',
    })

    const response = await request(fastify.server)
      .post(UsersRoutes.SESSIONS)
      .send({
        email: 'johm@doe.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.token).toEqual(expect.any(String))
  })

  it('should not be able to authenticate a non-existing user', async () => {
    const response = await request(fastify.server)
      .post(UsersRoutes.SESSIONS)
      .send({
        email: 'non-existing@user.com',
        password: '123456',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.data).toBe('Invalid credentials.')
  })
})
