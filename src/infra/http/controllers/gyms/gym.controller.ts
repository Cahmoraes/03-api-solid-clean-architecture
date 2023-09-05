import { HTTPMethodTypes, HttpServer } from '../../servers/http-server'
import { Routes } from '../routes.enum'
import { CreateGymController } from './create-gym.controller'
import { FetchNearbyGymsController } from './fetch-neaby-gyms.controller'
import { SearchGymsController } from './search-gyms.controller'

export class GymController {
  constructor(private readonly httpServer: HttpServer) {
    this.init()
  }

  private init(): void {
    this.handleCreateGym()
    this.handleSearchGyms()
    this.handleNearbyGyms()
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
      Routes.GYMS_SEARCH,
      new SearchGymsController().handleRequest,
    )
  }

  private handleNearbyGyms(): void {
    this.httpServer.on(
      HTTPMethodTypes.GET,
      Routes.GYMS_NEARBY,
      new FetchNearbyGymsController().handleRequest,
    )
  }
}
