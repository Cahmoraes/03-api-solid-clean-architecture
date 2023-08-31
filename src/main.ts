import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { MainHttpController } from './infra/http/controllers/main-http-controller'
import { FastifyAdapter } from './infra/http/servers/fastify-adapter'
import { AuthenticateUseCase } from './application/use-cases/authenticate.usecase'
import { provide } from './infra/dependency-inversion/registry'
import { PrismaUsersRepository } from './infra/repositories/prisma/prisma-users-repository'

const httpServer = new FastifyAdapter()
provide('usersRepository', new PrismaUsersRepository())
provide('createUserUseCase', new CreateUserUseCase())
provide('authenticateUseCase', new AuthenticateUseCase())
new MainHttpController(httpServer)
httpServer.listen()
