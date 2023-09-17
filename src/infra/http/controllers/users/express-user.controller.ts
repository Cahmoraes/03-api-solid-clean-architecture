import { expressJwtVerifyMiddleware } from '../../servers/express/middleware/jwt-verify.middleware'
import { MiddlewareProps } from '../../servers/http-server'
import { UserController } from './user.controller'

export class ExpressUserController extends UserController {
  protected createMiddleware(): MiddlewareProps {
    return {
      onRequest: expressJwtVerifyMiddleware,
    }
  }
}
