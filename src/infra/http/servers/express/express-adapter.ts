import express, { Request, Response, RequestHandler, Express } from 'express'
import {
  HTTPMethodTypes,
  HttpHandler,
  HttpServer,
  MiddlewareProps,
} from '../http-server'
import { env } from '@/env'
import { ExpressHttpHandlerParams } from './express-http-handler-params'

interface ExpressAdapterProps {
  port?: number
  host?: string
}

export class ExpressAdapter implements HttpServer {
  private readonly httpServer = express()
  private readonly PORT: number
  private readonly HOST: string

  constructor(props?: ExpressAdapterProps) {
    this.PORT = props?.port ?? env.PORT
    this.HOST = props?.host ?? env.HOST
    this.registerJSON()
  }

  private registerJSON() {
    this.httpServer.use(express.json())
  }

  public get server(): Express {
    return this.httpServer
  }

  async listen(): Promise<void> {
    try {
      await this.performListen()
    } catch (error) {
      console.error(error)
    }
  }

  private async performListen(): Promise<void> {
    this.httpServer.listen(this.PORT, () => {
      console.log(
        `[EXPRESS] 🚀 Server is running on http://${this.HOST}:${this.PORT}`,
      )
    })
  }

  public on(
    method: HTTPMethodTypes,
    route: string,
    handler: HttpHandler,
    middleware: MiddlewareProps,
  ): void {
    this.httpServer[method](
      route,
      ...this.createMiddlewares(middleware),
      this.createHandler(handler),
    )
  }

  private createMiddlewares(middleware: MiddlewareProps): RequestHandler[] {
    if (!middleware) return []
    return Object.values(middleware).reduce(
      (middlewares, middleware) => middlewares.concat(middleware),
      [],
    )
  }

  private createHandler(handler: HttpHandler) {
    return async (request: Request, reply: Response) => {
      const response = await handler(
        new ExpressHttpHandlerParams(request, reply),
      )
      if (response.isLeft()) {
        return reply
          .status(response.value.status)
          .send(response.value.formatError())
      }
      reply.status(response.value.status).send(response.value.data)
    }
  }
}
