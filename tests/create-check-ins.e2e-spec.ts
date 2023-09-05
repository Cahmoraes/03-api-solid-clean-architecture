import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { provideDependencies } from './utils/provide-dependencies'
import { PrismaGymsRepository } from '@/infra/repositories/prisma/prisma-gyms-repository'
import { Gym } from '@/application/entities/gym.entity'
import { createAndAuthenticateUser } from './utils/create-and-authenticate-user'

describe('Create CheckIn (e2e)', () => {
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

  it('should be able to create a check-in', async () => {
    const gym = Gym.create({
      title: 'Academia TypeScript Gym',
      latitude: -27.0747279,
      longitude: -49.4889672,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    })
    const gymsRepository = new PrismaGymsRepository()
    await gymsRepository.save(gym)
    const { token } = await createAndAuthenticateUser(fastify)
    const gymId = gym.id.toString()
    const response = await request(fastify.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      })

    expect(response.body).toMatchObject({
      id: expect.any(String),
      gymId,
    })
    expect(response.statusCode).toBe(201)
  })
})
