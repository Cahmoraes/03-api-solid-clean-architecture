import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { AuthenticateController } from './authenticate.controller'
import { CreateUserController } from './create-user.controller'
import { GetUserProfileController } from './get-user-profile.controller'
import { RefreshController } from './refresh.controller'
import { UpdatePasswordController } from './update-password.controller'

export class UserController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateUser()
    this.handleAuthenticate()
    this.handleMe()
    this.handleTokenRefresh()
    this.handleUpdatePassword()
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
      HTTPMethodTypes.GET,
      Routes.ME,
      new GetUserProfileController().handleRequest,
      {
        onRequest: jwtVerify,
      },
    )
  }

  private handleTokenRefresh(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      Routes.TOKEN_REFRESH,
      new RefreshController().handleRequest,
    )
  }

  private handleUpdatePassword(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      Routes.USERS_PASSWORD,
      new UpdatePasswordController().handleRequest,
      {
        onRequest: jwtVerify,
      },
    )
  }
}
