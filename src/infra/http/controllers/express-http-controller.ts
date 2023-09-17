import { CheckInController } from './check-ins/check-in.controller'
import { ExpressCheckInController } from './check-ins/express-check-in.controller'
import { ExpressGymController } from './gyms/express-gym.controller'
import { GymController } from './gyms/gym.controller'
import { HttpController } from './http-controller'
import { ExpressUserController } from './users/express-user.controller'
import { UserController } from './users/user.controller'

export class ExpressHttpController extends HttpController {
  protected init(): void {
    this.createUserController()
    this.createGymController()
    this.createCheckInController()
  }

  private createUserController(): UserController {
    return new ExpressUserController(this.httpServer)
  }

  private createGymController(): GymController {
    return new ExpressGymController(this.httpServer)
  }

  private createCheckInController(): CheckInController {
    return new ExpressCheckInController(this.httpServer)
  }
}
