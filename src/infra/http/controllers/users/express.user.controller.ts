import { expressJwtVerifyMiddleware } from '../../servers/express/middleware/jwt-verify.middleware'
import { HttpServer, MiddlewareProps } from '../../servers/http-server'
import { UserController } from './user.controller'

export class ExpressUserController extends UserController {
  constructor(httpServer: HttpServer) {
    super(httpServer)
  }

  protected createMiddleware(): MiddlewareProps {
    return {
      onRequest: expressJwtVerifyMiddleware,
    }
  }
}
