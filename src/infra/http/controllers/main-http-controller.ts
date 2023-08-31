import { Routes } from './routes.enum'
import { CreateUserController } from './users/create-user.controller'
import { HTTPMethodTypes, HttpServer } from '../servers/http-server'
import { AuthenticateController } from './users/authenticate.controller'
import { ProfileController } from './users/profile.controller'

export class MainHttpController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateUser()
    this.handleAuthenticate()
    this.handleMe()
  }

  private handleCreateUser(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.USERS,
      new CreateUserController().handleRequest,
    )
  }

  private handleAuthenticate(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.SESSIONS,
      new AuthenticateController().handleRequest,
    )
  }

  private handleMe(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.ME,
      new ProfileController().handleRequest,
    )
  }
}
