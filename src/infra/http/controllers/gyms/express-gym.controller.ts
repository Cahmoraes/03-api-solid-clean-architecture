import { expressVerifyUserRole } from '../../servers/express/middleware/express-verify-user-role.middleware'
import { expressJwtVerifyMiddleware } from '../../servers/express/middleware/jwt-verify.middleware'
import { MiddlewareProps } from '../../servers/http-server'
import { GymController } from './gym.controller'

export class ExpressGymController extends GymController {
  protected createMiddlewares(): MiddlewareProps {
    return {
      onRequest: [expressJwtVerifyMiddleware, expressVerifyUserRole('ADMIN')],
    }
  }
}
