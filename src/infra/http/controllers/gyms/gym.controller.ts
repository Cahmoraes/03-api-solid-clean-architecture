import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'

export class UserController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {}
}
