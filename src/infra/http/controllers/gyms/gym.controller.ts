import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { CreateGymController } from './create-gym.controller'
import { SearchGymsController } from './search-gyms.controller'

export class GymController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateGym()
    this.handleSearchGyms()
  }

  private handleCreateGym(): void {
    this.httpServer.on(
      HTTPMethodTypes.POST,
      Routes.GYMS,
      new CreateGymController().handleRequest,
    )
  }

  private handleSearchGyms(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      Routes.GYMS,
      new SearchGymsController().handleRequest,
    )
  }
}
