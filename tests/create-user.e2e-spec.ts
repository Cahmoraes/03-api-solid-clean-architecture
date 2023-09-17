import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { provideDependencies } from './utils/provide-dependencies'
import { FastifyHttpController } from '@/infra/http/controllers/fastify-http-controller'

describe('Create User (e2e)', () => {
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

  it('should be able to create an user', async () => {
    const response = await request(fastify.server).post(Routes.USERS).send({
      name: 'John Doe',
      email: 'johm@doe.com',
      password: '123456',
      role: 'ADMIN',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'johm@doe.com',
      createdAt: expect.any(String),
      role: 'ADMIN',
    })
  })
})
