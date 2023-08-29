import Fastify from 'fastify'
import { HTTPMethodTypes, HttpHandler, HttpServer } from './http-server'
import { env, isProduction } from '@/env'
import { ZodError } from 'zod'

export class FastifyAdapter implements HttpServer {
  private httpServer = Fastify()

  async listen(): Promise<void> {
    try {
      this.errorHandler()
      await this.performListen()
    } catch (error) {
      console.error(error)
    }
  }

  private errorHandler() {
    this.httpServer.setErrorHandler(function (error, request, reply) {
      if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        this.log.error(error)
        return reply.status(500).send({ ok: false })
      }
      if (error instanceof ZodError) {
        return reply
          .status(400)
          .send({ message: 'Validation error', issues: error.format() })
      }

      if (!isProduction()) {
        console.error(error)
      }

      return reply.status(500).send({ message: 'Internal Server Error' })
    })
  }

  private async performListen(): Promise<void> {
    await this.httpServer.listen({ port: env.PORT, host: env.HOST })
    console.log(`🚀 Server is running on http://${env.HOST}:${env.PORT}`)
  }

  public on(
    method: HTTPMethodTypes,
    route: string,
    handler: HttpHandler,
  ): void {
    this.httpServer[method](route, async (request, reply) => {
      const response = await handler(request.body, request.params)
      if (response.isLeft()) {
        console.log('aqui')
        return reply.status(response.value.status).send(response.value.toDto())
      }
      reply.status(response.value.status).send(response.value.data)
    })
  }
}
