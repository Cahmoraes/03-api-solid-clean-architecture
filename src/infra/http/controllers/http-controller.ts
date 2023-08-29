import { Routes } from './routes'
import { CreateUserController } from './users/create-user.controller'
import { HTTPMethodTypes, HttpServer } from '../servers/http-server'
import { AuthenticateController } from './users/authenticate.controller'

export class HttpController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateUser()
    this.handleAuthenticate()
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
}
