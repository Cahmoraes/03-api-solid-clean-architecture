import { HttpServer } from '../servers/http-server'
import { GymController } from './gyms/gym.controller'
import { UserController } from './users/user.controller'

export class MainHttpController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.createUserController()
    this.createGymController()
  }

  private createUserController(): UserController {
    return new UserController(this.httpServer)
  }

  private createGymController(): GymController {
    return new GymController(this.httpServer)
  }
}
