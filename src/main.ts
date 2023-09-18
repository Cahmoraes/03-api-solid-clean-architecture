import '@/infra/dependency-inversion/container'
import { DomainEventPublisher } from './application/events/domain-event-publisher'
import { UserCreatedSubscriber } from './application/events/user-created/user-created-subscriber'
import { GymCreatedSubscriber } from './application/events/gym-created/gym-created-subscriber'
import { UserAuthenticatedSubscriber } from './application/events/user-authenticated/user-authenticated-subscriber'
import { ProductionLogger } from './infra/logger/production-logger'
import { HttpControllerFactory } from './infra/http/controllers/factories/http-controller-factory'
import { HttpServerFactory } from './infra/http/servers/factories/http-server-factory'
import { serverArgv } from './argv'

DomainEventPublisher.getInstance().subscribe(new UserCreatedSubscriber())
DomainEventPublisher.getInstance().subscribe(new GymCreatedSubscriber())
DomainEventPublisher.getInstance().subscribe(
  new UserAuthenticatedSubscriber(new ProductionLogger()),
)
const httpServer = HttpServerFactory.create(serverArgv)
const HttpController = HttpControllerFactory.create(httpServer)
new HttpController(httpServer)
httpServer.listen()
