import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { HTTPMethodTypes, HttpHandlerParams, HttpServer } from '../http-server'
import { env, isProduction } from '@/env'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import { FastifyHttpHandlerParams } from './fastify-http-handler-params'
import { EitherType } from '@cahmoraes93/either'
import { FailResponse } from '../../entities/fail-response'
import { SuccessResponse } from '../../entities/success-response'
import { Server } from 'http'

export type FastifyHttpHandlerType = (
  httpHandlerParams: HttpHandlerParams<FastifyRequest, FastifyReply>,
) => Promise<EitherType<FailResponse<Error>, SuccessResponse<unknown>>>

interface FastifyAdapterProps {
  port?: number
  host?: string
}

export class FastifyAdapter implements HttpServer {
  private readonly httpServer = Fastify()
  private readonly PORT: number
  private readonly HOST: string
  private readonly EXPIRES_IN = '10m'

  constructor(props?: FastifyAdapterProps) {
    this.PORT = props?.port ?? env.PORT
    this.HOST = props?.host ?? env.HOST
    this.registerJWT()
    this.registerCookie()
    this.errorHandler()
  }

  public get server(): Server {
    return this.httpServer.server
  }

  public async close(): Promise<void> {
    this.httpServer.close()
  }

  public async ready(): Promise<void> {
    return this.httpServer.ready()
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
      sign: {
        expiresIn: this.EXPIRES_IN,
      },
      cookie: {
        cookieName: 'refreshToken',
        signed: false,
      },
    })
  }

  private registerCookie(): void {
    this.httpServer.register(fastifyCookie)
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
    await this.httpServer.listen({ port: this.PORT, host: this.HOST })
    console.log(`🚀 Server is running on http://${this.HOST}:${this.PORT}`)
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
