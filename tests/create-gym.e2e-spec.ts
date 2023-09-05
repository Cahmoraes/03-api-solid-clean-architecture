import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { provideDependencies } from './utils/provide-dependencies'

describe('Create Gym (e2e)', () => {
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

  it('should be able to create a gym', async () => {
    const response = await request(fastify.server).post(Routes.GYMS).send({
      title: 'Academia TypeScript Gym',
      latitude: -27.0747279,
      longitude: -49.4889672,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    })

    expect(response.statusCode).toBe(201)
  })
})
