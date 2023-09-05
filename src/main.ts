import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { MainHttpController } from './infra/http/controllers/main-http-controller'
import { FastifyAdapter } from './infra/http/servers/fastify/fastify-adapter'
import { AuthenticateUseCase } from './application/use-cases/authenticate.usecase'
import { provide } from './infra/dependency-inversion/registry'
import { PrismaUsersRepository } from './infra/repositories/prisma/prisma-users-repository'
import { GetUserMetricsUseCase } from './application/use-cases/get-user-metrics.usecase'
import { InMemoryCheckInsRepository } from '@/tests/repositories/in-memory-check-ins-repository'
import { DomainEventPublisher } from './application/events/domain-event-publisher'
import { UserCreatedSubscriber } from './application/events/user-created/user-created-subscriber'
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.usecase'

DomainEventPublisher.getInstance().subscribe(new UserCreatedSubscriber())
provide('usersRepository', new PrismaUsersRepository())
provide('checkInsRepository', new InMemoryCheckInsRepository())
provide('createUserUseCase', new CreateUserUseCase())
provide('authenticateUseCase', new AuthenticateUseCase())
provide('getUserMetricsUseCase', new GetUserMetricsUseCase())
provide('getUserProfileUseCase', new GetUserProfileUseCase())
const httpServer = new FastifyAdapter()
new MainHttpController(httpServer)
httpServer.listen()
