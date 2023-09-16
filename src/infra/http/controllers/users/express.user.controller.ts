import { expressJwtVerifyMiddleware } from '../../servers/express/middleware/jwt-verify.middleware'
import { HTTPMethodTypes } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { GetUserProfileController } from './get-user-profile.controller'
import { UserController } from './user.controller'

export class ExpressUserController extends UserController {
  protected init(): void {
    this.handleCreateUser()
    this.handleMe()
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
}
