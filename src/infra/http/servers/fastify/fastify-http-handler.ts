import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpHandlerParams, JwtHandlers } from './http-server'
import { FastifyJwtHandlers } from './fastify-jwt-handlers'

export class FastifyHttpHandler implements HttpHandlerParams {
  constructor(
    private fastifyRequest: FastifyRequest,
    private fastifyReply: FastifyReply,
  ) {}

  get body(): unknown {
    return this.fastifyRequest.body
  }

  get params(): unknown {
    return this.fastifyRequest.params
  }

  get jwtHandler(): JwtHandlers {
    return new FastifyJwtHandlers(this.fastifyRequest, this.fastifyReply)
  }
}
