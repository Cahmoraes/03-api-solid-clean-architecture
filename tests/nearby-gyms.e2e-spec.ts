import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { provideDependencies } from './utils/provide-dependencies'
import { createAndAuthenticateUser } from './utils/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
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

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(fastify)

    await request(fastify.server).post(Routes.GYMS).send({
      title: 'Academia JavaScript Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
      description: 'Fake JavaScript Gym',
      phone: '00-0000-0000',
    })

    await request(fastify.server).post(Routes.GYMS).send({
      title: 'Academia TypeScript Gym',
      latitude: -27.0610928,
      longitude: -49.5229501,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    })

    const response = await request(fastify.server)
      .get(Routes.GYMS_NEARBY)
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body).toHaveLength(1)
    expect(response.body).toEqual([
      expect.objectContaining({
        title: 'Academia JavaScript Gym',
      }),
    ])
  })
})
