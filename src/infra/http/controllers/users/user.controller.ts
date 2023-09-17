import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import {
  HTTPMethodTypes,
  HttpServer,
  MiddlewareProps,
} from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { AuthenticateController } from './authenticate.controller'
import { CreateUserController } from './create-user.controller'
import { GetUserProfileController } from './get-user-profile.controller'
import { RefreshController } from './refresh.controller'
import { UpdatePasswordController } from './update-password.controller'

export class UserController {
  constructor(protected readonly httpServer: HttpServer) {
    this.init()
  }

  protected init(): void {
    this.handleCreateUser()
    this.handleAuthenticate()
    this.handleMe()
    this.handleTokenRefresh()
    this.handleUpdatePassword()
  }

  protected handleCreateUser(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.USERS,
      new CreateUserController().handleRequest,
    )
  }

  protected handleAuthenticate(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.SESSIONS,
      new AuthenticateController().handleRequest,
    )
  }

  protected handleMe(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      Routes.ME,
      new GetUserProfileController().handleRequest,
      this.createMiddleware(),
    )
  }

  protected handleTokenRefresh(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      Routes.TOKEN_REFRESH,
      new RefreshController().handleRequest,
    )
  }

  protected handleUpdatePassword(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      Routes.USERS_PASSWORD,
      new UpdatePasswordController().handleRequest,
      this.createMiddleware(),
    )
  }

  protected createMiddleware(): MiddlewareProps {
    return {
      onRequest: jwtVerify,
    }
  }
}
