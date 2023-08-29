import { Routes } from './routes'
import { CreateUserController } from './users/create-user.controller'
import { HTTPMethodTypes, HttpServer } from '../servers/http-server'
import { CreateUser } from '@/application/use-cases/create-user'
import { inject } from '@/application/registry'

export class HttpController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateUser()
  }

  private handleCreateUser(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.USERS,
      new CreateUserController().handleRequest,
    )
  }
}
