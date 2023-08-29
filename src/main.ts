import { CreateUser } from './application/use-cases/create-user'
import { HttpController } from './infra/http/controllers/http-controller'
import { FastifyAdapter } from './infra/http/servers/fastify-adapter'
import { PrismaUsersRepository } from './infra/repositories/prisma-users-repository'
import { provide } from './application/registry'

const httpServer = new FastifyAdapter()
provide('usersRepository', new PrismaUsersRepository())
provide('createUserUseCase', new CreateUser())
new HttpController(httpServer)
httpServer.listen()
