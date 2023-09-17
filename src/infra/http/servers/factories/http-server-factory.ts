import { ExpressAdapter } from '../express/express-adapter'
import { FastifyAdapter } from '../fastify/fastify-adapter'
import { HttpServer } from '../http-server'
type ServerType = 'FASTIFY' | 'EXPRESS'

export class HttpServerFactory {
  static create(aServer: ServerType): HttpServer {
    switch (aServer) {
      case 'FASTIFY':
        return new FastifyAdapter()
      case 'EXPRESS':
        return new ExpressAdapter()
      default:
        throw new Error('Invalid server type')
    }
  }
}
