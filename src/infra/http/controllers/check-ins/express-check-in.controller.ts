import { expressVerifyUserRole } from '../../servers/express/middleware/express-verify-user-role.middleware'
import { expressJwtVerifyMiddleware } from '../../servers/express/middleware/jwt-verify.middleware'
import { MiddlewareProps } from '../../servers/http-server'
import { CheckInController } from './check-in.controller'

export class ExpressCheckInController extends CheckInController {
  protected createJwtVerifyMiddleware(): MiddlewareProps {
    return {
      onRequest: expressJwtVerifyMiddleware,
    }
  }

  protected createMiddlewares(): MiddlewareProps {
    return {
      onRequest: [expressJwtVerifyMiddleware, expressVerifyUserRole('ADMIN')],
    }
  }
}
