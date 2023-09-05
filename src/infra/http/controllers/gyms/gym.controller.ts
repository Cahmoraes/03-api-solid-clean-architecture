import { CreateGymUseCase } from '@/application/use-cases/create-gym.usecase'
import { jwtVerify } from '../../servers/fastify/middleware/jwt-verify.middleware'
import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { CreateGymController } from './create-gym.controller'

export class GymController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateGym()
  }

  private handleCreateGym(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.GYMS,
      new CreateGymController().handleRequest,
    )
  }
}
