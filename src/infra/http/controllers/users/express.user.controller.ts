import { expressJwtVerifyMiddleware } from '../../servers/express/middleware/jwt-verify.middleware'
import { HTTPMethodTypes } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { GetUserProfileController } from './get-user-profile.controller'
import { UpdatePasswordController } from './update-password.controller'
import { UserController } from './user.controller'

export class ExpressUserController extends UserController {
  protected init(): void {
    this.handleCreateUser()
    this.handleAuthenticate()
    this.handleMe()
    this.handleTokenRefresh()
    this.handleUpdatePassword()
  }

  protected handleMe(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      Routes.ME,
      new GetUserProfileController().handleRequest,
      {
        onRequest: expressJwtVerifyMiddleware,
      },
    )
  }

  protected handleUpdatePassword(): void {
    this.httpServer.on(
      HTTPMethodTypes.PATCH,
      Routes.USERS_PASSWORD,
      new UpdatePasswordController().handleRequest,
      {
        onRequest: expressJwtVerifyMiddleware,
      },
    )
  }
}
