import { Routes } from './routes.enum'
import { CreateUserController } from './users/create-user.controller'
import { AuthenticateController } from './users/authenticate.controller'
import { GetUserProfileController } from './users/get-user-profile.controller'
import { HTTPMethodTypes, HttpServer } from '../servers/http-server'
import { jwtVerify } from '../servers/fastify/middleware/jwt-verify.middleware'

export class MainHttpController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateUser()
    this.handleAuthenticate()
    this.handleMe()
  }

  private handleCreateUser(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.USERS,
      new CreateUserController().handleRequest,
    )
  }

  private handleAuthenticate(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.SESSIONS,
      new AuthenticateController().handleRequest,
    )
  }

  private handleMe(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.ME,
      new GetUserProfileController().handleRequest,
      {
        onRequest: jwtVerify,
      },
    )
  }
}
