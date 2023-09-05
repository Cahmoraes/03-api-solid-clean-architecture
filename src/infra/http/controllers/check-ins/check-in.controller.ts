import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { CreateCheckInController } from './create-check-ins.controller'

export class CheckInController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateCheckIn()
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
}
