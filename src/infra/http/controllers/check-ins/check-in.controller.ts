import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { GetUserMetricsController } from '../users/get-user-metrics.controller'
import { CreateCheckInController } from './create-check-ins.controller'
import { FetchUserCheckInsHistoryController } from './fetch-user-check-ins-history.controller'
import { ValidateCheckInController } from './validate-check-in.controller'
import { verifyUserRole } from '../../servers/fastify/middleware/verify-user-role.middleware'

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
      Routes.CHECKINS_CREATE,
      new CreateCheckInController().handleRequest,
      {
        onRequest: jwtVerify,
      },
    )
  }

  private handleValidateCheckIn(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      Routes.CHECKINS_VALIDATE,
      new ValidateCheckInController().handleRequest,
      {
        onRequest: [jwtVerify, verifyUserRole('ADMIN')],
      },
    )
  }

  private handleFetchUserCheckInsHistory(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      Routes.CHECKINS_HISTORY,
      new FetchUserCheckInsHistoryController().handleRequest,
      {
        onRequest: jwtVerify,
      },
    )
  }

  private handleGetUserMetrics(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      Routes.CHECKINS_METRICS,
      new GetUserMetricsController().handleRequest,
      {
        onRequest: jwtVerify,
      },
    )
  }
}
