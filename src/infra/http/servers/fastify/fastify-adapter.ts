import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { HTTPMethodTypes, HttpHandlerParams, HttpServer } from '../http-server'
import { env, isProduction } from '@/env'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { FastifyHttpHandlerParams } from './fastify-http-handler-params'
import { EitherType } from '@cahmoraes93/either'
import { FailResponse } from '../../entities/fail-response'
import { SuccessResponse } from '../../entities/success-response'

export type FastifyHttpHandlerType = (
  httpHandlerParams: HttpHandlerParams<FastifyRequest, FastifyReply>,
) => Promise<EitherType<FailResponse<Error>, SuccessResponse<unknown>>>

export class FastifyAdapter implements HttpServer {
  private httpServer = Fastify()

  constructor() {
    this.registerJWT()
    this.errorHandler()
  }

  async listen(): Promise<void> {
    try {
      await this.performListen()
    } catch (error) {
      console.error(error)
    }
  }

  private registerJWT(): void {
    this.httpServer.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    })
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
    handler: FastifyHttpHandlerType,
    middleware = {},
  ): void {
    this.httpServer[method](route, middleware, async (request, reply) => {
      const response = await handler(
        new FastifyHttpHandlerParams(request, reply),
      )
      if (response.isLeft()) {
        return reply
          .status(response.value.status)
          .send(response.value.formatError())
      }
      reply.status(response.value.status).send(response.value.data)
    })
  }
}
