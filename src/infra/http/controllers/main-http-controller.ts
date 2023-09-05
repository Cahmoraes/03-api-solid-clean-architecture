import { HttpServer } from '../servers/http-server'
import { UserController } from './users/user.controller'

export class MainHttpController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.createUserController()
  }

  private createUserController(): UserController {
    return new UserController(this.httpServer)
  }
}
