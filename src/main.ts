import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { HttpController } from './infra/http/controllers/http-controller'
import { FastifyAdapter } from './infra/http/servers/fastify-adapter'
import { PrismaUsersRepository } from './infra/repositories/prisma-users-repository'
import { AuthenticateUseCase } from './application/use-cases/authenticate.usecase'
import { provide } from './infra/dependency-inversion/registry'

const httpServer = new FastifyAdapter()
provide('usersRepository', new PrismaUsersRepository())
provide('createUserUseCase', new CreateUserUseCase())
provide('authenticateUseCase', new AuthenticateUseCase())
new HttpController(httpServer)
httpServer.listen()
