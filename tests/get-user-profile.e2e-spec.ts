import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { GetUserProfileUseCase } from '@/application/use-cases/get-user-profile.usecase'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { provide } from '@/infra/dependency-inversion/registry'
import { PrismaGymsRepository } from '@/infra/repositories/prisma/prisma-gyms-repository'
import { PrismaCheckInsRepository } from '@/infra/repositories/prisma/prisma-check-ins-repository'
import { CreateGymUseCase } from '@/application/use-cases/create-gym.usecase'
import { SearchGymsUseCase } from '@/application/use-cases/search-gyms.usecase'
import { FetchNearbyGymsUseCase } from '@/application/use-cases/fetch-nearby-gym.usecase'

describe('Get User Profile (e2e)', () => {
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

  it('should be able to authenticate an user', async () => {
    await request(fastify.server).post(Routes.USERS).send({
      name: 'John Doe',
      email: 'johm@doe.com',
      password: '123456',
    })

    const sessionResponse = await request(fastify.server)
      .post(Routes.SESSIONS)
      .send({
        email: 'johm@doe.com',
        password: '123456',
      })

    const token = sessionResponse.body.token

    const profileResponse = await request(fastify.server)
      .get(Routes.ME)
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.body).toMatchObject({
      id: expect.any(String),
      name: 'John Doe',
      email: 'johm@doe.com',
      createdAt: expect.any(String),
    })
  })
})
