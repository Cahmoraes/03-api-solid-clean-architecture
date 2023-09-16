import { HttpServer } from '../servers/http-server'

export abstract class HttpController {
  constructor(protected readonly httpServer: HttpServer) {
    this.init()
  }

  protected abstract init(): void
}
