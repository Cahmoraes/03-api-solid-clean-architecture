import getPort from 'get-port'
import request from 'supertest'
import { provide } from '@/infra/dependency-inversion/registry'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { PrismaGymsRepository } from '@/infra/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '@/application/use-cases/create-gym.usecase'
import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { PrismaCheckInsRepository } from '@/infra/repositories/prisma/prisma-check-ins-repository'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { GetUserProfileUseCase } from '@/application/use-cases/get-user-profile.usecase'
import { SearchGymsUseCase } from '@/application/use-cases/search-gyms.usecase'
import { FetchNearbyGymsUseCase } from '@/application/use-cases/fetch-nearby-gym.usecase'

describe('Create Gym (e2e)', () => {
  let fastify: FastifyAdapter
  beforeAll(async () => {
    provide('usersRepository', new PrismaUsersRepository())
    provide('gymsRepository', new PrismaGymsRepository())
    provide('checkInsRepository', new PrismaCheckInsRepository())
    provide('createUserUseCase', new CreateUserUseCase())
    provide('authenticateUseCase', new AuthenticateUseCase())
    provide('getUserMetricsUseCase', new GetUserMetricsUseCase())
    provide('getUserProfileUseCase', new GetUserProfileUseCase())
    provide('createGymUseCase', new CreateGymUseCase())
    provide('searchGymsUseCase', new SearchGymsUseCase())
    provide('fetchNearbyGymsUseCase', new FetchNearbyGymsUseCase())

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
