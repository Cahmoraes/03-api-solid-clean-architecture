import { provide } from '@/infra/dependency-inversion/registry'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import request from 'supertest'
import { InMemoryCheckInsRepository } from './repositories/in-memory-check-ins-repository'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'

describe('Register (e2e)', () => {
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

  it('should be able to register', async () => {
    const response = await request(fastify.app.server).post('/users').send({
      name: 'John Doe',
      email: 'johm@dossse.com',
      password: '123456',
    })
    console.log(response.body)
  })
})
