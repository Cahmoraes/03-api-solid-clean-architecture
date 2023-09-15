import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { provideDependencies } from './utils/provide-dependencies'

describe('Authenticate (e2e)', () => {
  let fastify: FastifyAdapter
  beforeAll(async () => {
    provideDependencies()
    const port = await getPort()
    fastify = new FastifyAdapter({ port })
    new MainHttpController(fastify)
    await fastify.listen()
  })

  afterAll(async () => {
    await fastify.close()
  })

  it.only('should be able to authenticate an user', async () => {
    await request(fastify.server).post(Routes.USERS).send({
      name: 'John Doe',
      email: 'johm@doe.com',
      password: '123456',
    })

    const response = await request(fastify.server).post(Routes.SESSIONS).send({
      email: 'johm@doe.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.token).toEqual(expect.any(String))
  })

  it('should not be able to authenticate a non-existing user', async () => {
    const response = await request(fastify.server).post(Routes.SESSIONS).send({
      email: 'non-existing@user.com',
      password: '123456',
    })
    expect(response.statusCode).toBe(400)
    expect(response.body.data).toBe('Invalid credentials.')
  })
})
