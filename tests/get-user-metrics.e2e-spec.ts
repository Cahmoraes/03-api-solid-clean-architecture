import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { provideDependencies } from './utils/provide-dependencies'
import { PrismaGymsRepository } from '@/infra/repositories/prisma/prisma-gyms-repository'
import { Gym } from '@/application/entities/gym.entity'
import { createAndAuthenticateUser } from './utils/create-and-authenticate-user'
import { PrismaCheckInsRepository } from '@/infra/repositories/prisma/prisma-check-ins-repository'
import { CheckIn } from '@/application/entities/check-in.entity'
import { makePrismaClient } from '@/infra/connection/prisma'
import { FastifyHttpController } from '@/infra/http/controllers/fastify-http-controller'
import { CheckInsRoutes } from '@/infra/http/controllers/routes/check-ins-routes.enum'

describe('Check-in Metrics (e2e)', () => {
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

  it('should be able to get the total count of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(fastify)
    const prisma = makePrismaClient()
    const user = await prisma.user.findFirstOrThrow()
    const gym = Gym.create({
      title: 'Academia TypeScript Gym',
      latitude: -27.0747279,
      longitude: -49.4889672,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    }).value as Gym
    const gymsRepository = new PrismaGymsRepository()
    await gymsRepository.save(gym)

    const checkIn1 = CheckIn.create({
      gymId: gym.id.toString(),
      userId: user.id,
    })
    const checkIn2 = CheckIn.create({
      gymId: gym.id.toString(),
      userId: user.id,
    })
    const checkInRepository = new PrismaCheckInsRepository()
    await checkInRepository.save(checkIn1)
    await checkInRepository.save(checkIn2)

    const response = await request(fastify.server)
      .get(CheckInsRoutes.CHECKINS_METRICS)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkInsCount).toBe(2)
  })
})
