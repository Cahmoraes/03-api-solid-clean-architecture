import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import {
  HTTPMethodTypes,
  HttpServer,
  MiddlewareProps,
} from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { GetUserMetricsController } from '../users/get-user-metrics.controller'
import { CreateCheckInController } from './create-check-ins.controller'
import { FetchUserCheckInsHistoryController } from './fetch-user-check-ins-history.controller'
import { ValidateCheckInController } from './validate-check-in.controller'
import { verifyUserRole } from '../../servers/fastify/middleware/verify-user-role.middleware'
import { CheckInsRoutes } from '../routes/check-ins-routes.enum'

export class CheckInController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateCheckIn()
    this.handleValidateCheckIn()
    this.handleFetchUserCheckInsHistory()
    this.handleGetUserMetrics()
  }

  private handleCreateCheckIn(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      CheckInsRoutes.CHECKINS_CREATE,
      new CreateCheckInController().handleRequest,
      this.createJwtVerifyMiddleware(),
    )
  }

  protected createJwtVerifyMiddleware(): MiddlewareProps {
    return {
      onRequest: jwtVerify,
    }
  }

  private handleValidateCheckIn(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      CheckInsRoutes.CHECKINS_VALIDATE,
      new ValidateCheckInController().handleRequest,
      this.createMiddlewares(),
    )
  }

  protected createMiddlewares(): MiddlewareProps {
    return {
      onRequest: [jwtVerify, verifyUserRole('ADMIN')],
    }
  }

  private handleFetchUserCheckInsHistory(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      CheckInsRoutes.CHECKINS_HISTORY,
      new FetchUserCheckInsHistoryController().handleRequest,
      this.createJwtVerifyMiddleware(),
    )
  }

  private handleGetUserMetrics(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      CheckInsRoutes.CHECKINS_METRICS,
      new GetUserMetricsController().handleRequest,
      this.createJwtVerifyMiddleware(),
    )
  }
}
