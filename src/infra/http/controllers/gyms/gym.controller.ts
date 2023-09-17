import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import { verifyUserRole } from '../../servers/fastify/middleware/verify-user-role.middleware'
import {
  HTTPMethodTypes,
  HttpServer,
  MiddlewareProps,
} from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { GymsRoutes } from '../routes/gyms.enum'
import { CreateGymController } from './create-gym.controller'
import { FetchNearbyGymsController } from './fetch-neaby-gyms.controller'
import { SearchGymsController } from './search-gyms.controller'

export class GymController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateGym()
    this.handleSearchGyms()
    this.handleNearbyGyms()
  }

  private handleCreateGym(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      GymsRoutes.GYMS,
      new CreateGymController().handleRequest,
      this.createMiddlewares(),
    )
  }

  protected createMiddlewares(): MiddlewareProps {
    return {
      onRequest: [jwtVerify, verifyUserRole('ADMIN')],
    }
  }

  private handleSearchGyms(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      GymsRoutes.GYMS_SEARCH,
      new SearchGymsController().handleRequest,
    )
  }

  private handleNearbyGyms(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      GymsRoutes.GYMS_NEARBY,
      new FetchNearbyGymsController().handleRequest,
    )
  }
}
