import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { provideDependencies } from './utils/provide-dependencies'
import { PrismaGymsRepository } from '@/infra/repositories/prisma/prisma-gyms-repository'
import { Gym } from '@/application/entities/gym.entity'
import { createAndAuthenticateUser } from './utils/create-and-authenticate-user'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { CheckIn } from '@/application/entities/check-in.entity'
import { makePrismaClient } from '@/infra/connection/prisma'
import { PrismaCheckInsRepository } from '@/infra/repositories/prisma/prisma-check-ins-repository'

describe('Validate CheckIn (e2e)', () => {
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

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(fastify)
    const gym = Gym.create({
      title: 'Academia TypeScript Gym',
      latitude: -27.0747279,
      longitude: -49.4889672,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    })
    const gymsRepository = new PrismaGymsRepository()
    await gymsRepository.save(gym)

    const prisma = makePrismaClient()
    const user = await prisma.user.findFirstOrThrow()

    const userId = user.id
    const gymId = gym.id.toString()
    const checkIn = CheckIn.create({
      userId,
      gymId,
    })
    const checkInRepository = new PrismaCheckInsRepository()
    await checkInRepository.save(checkIn)

    const checkInId = checkIn.id.toString()
    const createCheckInValidateRoute = Routes.CHECKINS_VALIDATE.replace(
      ':checkInId',
      checkInId,
    )

    const response = await request(fastify.server)
      .patch(createCheckInValidateRoute)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)
    const prismaCheckIn = await checkInRepository.checkInOfId(checkInId)
    expect(prismaCheckIn?.validatedAt).toBeDefined()
    expect(prismaCheckIn?.validatedAt).toEqual(expect.any(Date))
  })
})
