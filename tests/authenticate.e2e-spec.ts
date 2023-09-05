import request from 'supertest'
import { provide } from '@/infra/dependency-inversion/registry'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { InMemoryCheckInsRepository } from './repositories/in-memory-check-ins-repository'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'

describe('Authenticate (e2e)', () => {
  let fastify: FastifyAdapter
  beforeAll(async () => {
    provide('usersRepository', new PrismaUsersRepository())
    provide('checkInsRepository', new InMemoryCheckInsRepository())
    provide('createUserUseCase', new CreateUserUseCase())
    provide('authenticateUseCase', new AuthenticateUseCase())
    provide('getUserMetricsUseCase', new GetUserMetricsUseCase())

    fastify = new FastifyAdapter()
    new MainHttpController(fastify)
    await fastify.listen()
  })

  it('should be able to authenticate an user', async () => {
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
