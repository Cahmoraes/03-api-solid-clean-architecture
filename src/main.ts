import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { MainHttpController } from './infra/http/controllers/main-http-controller'
import { FastifyAdapter } from './infra/http/servers/fastify/fastify-adapter'
import { AuthenticateUseCase } from './application/use-cases/authenticate.usecase'
import { provide } from './infra/dependency-inversion/registry'
import { PrismaUsersRepository } from './infra/repositories/prisma/prisma-users-repository'
import { GetUserMetricsUseCase } from './application/use-cases/get-user-metrics.usecase'
import { DomainEventPublisher } from './application/events/domain-event-publisher'
import { UserCreatedSubscriber } from './application/events/user-created/user-created-subscriber'
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.usecase'
import { CreateGymUseCase } from './application/use-cases/create-gym.usecase'
import { PrismaGymsRepository } from './infra/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from './application/use-cases/search-gyms.usecase'
import { FetchNearbyGymsUseCase } from './application/use-cases/fetch-nearby-gym.usecase'
import { CreateCheckInUseCase } from './application/use-cases/create-check-in.usecase'
import { ValidateCheckInUseCase } from './application/use-cases/validate-check-in.usecase'
import { PrismaCheckInsRepository } from './infra/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './application/use-cases/fetch-user-check-ins-history.usecase'
import { GymCreatedSubscriber } from './application/events/gym-created/gym-created-subscriber'

DomainEventPublisher.getInstance().subscribe(new UserCreatedSubscriber())
DomainEventPublisher.getInstance().subscribe(new GymCreatedSubscriber())
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
provide('createCheckInUseCase', new CreateCheckInUseCase())
provide('validateCheckInUseCase', new ValidateCheckInUseCase())
provide(
  'fetchUserCheckInsHistoryUseCase',
  new FetchUserCheckInsHistoryUseCase(),
)
const httpServer = new FastifyAdapter()
new MainHttpController(httpServer)
httpServer.listen()
