import { HttpServer } from '../servers/http-server'
import { CheckInController } from './check-ins/check-in.controller'
import { GymController } from './gyms/gym.controller'
import { HttpController } from './http-controller'
import { ExpressUserController } from './users/express.user.controller'
import { UserController } from './users/user.controller'

export class ExpressHttpController extends HttpController {
  protected init(): void {
    this.createUserController()
    // this.createGymController()
    // this.createCheckInController()
  }

  private createUserController(): UserController {
    return new ExpressUserController(this.httpServer)
  }

  private createGymController(): GymController {
    return new GymController(this.httpServer)
  }

  private createCheckInController(): CheckInController {
    return new CheckInController(this.httpServer)
  }
}
