import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { provideDependencies } from './utils/provide-dependencies'
import { createAndAuthenticateAdmin } from './utils/create-and-authenticate-admin'
import { FastifyHttpController } from '@/infra/http/controllers/fastify-http-controller'
import { GymsRoutes } from '@/infra/http/controllers/routes/gyms.enum'

describe('Create Gym (e2e)', () => {
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

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateAdmin(fastify)
    const response = await request(fastify.server)
      .post(GymsRoutes.GYMS)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia TypeScript Gym',
        latitude: -27.0747279,
        longitude: -49.4889672,
        description: 'Fake TypeScript Gym',
        phone: '00-0000-0000',
      })

    expect(response.statusCode).toBe(201)
  })
})
