import { ExpressAdapter } from '../../servers/express/express-adapter'
import { FastifyAdapter } from '../../servers/fastify/fastify-adapter'
import { HttpServer } from '../../servers/http-server'
import { ExpressHttpController } from '../express-http-controller'
import { FastifyHttpController } from '../fastify-http-controller'
import { HttpController } from '../http-controller'

type Constructor<Type> = new (aHttpServer: HttpServer) => Type

export class HttpControllerFactory {
  public static create(aHttpServer: HttpServer): Constructor<HttpController> {
    if (aHttpServer instanceof ExpressAdapter) {
      return ExpressHttpController
    }
    if (aHttpServer instanceof FastifyAdapter) {
      return FastifyHttpController
    }
    throw new Error('The http server is not supported')
  }
}
