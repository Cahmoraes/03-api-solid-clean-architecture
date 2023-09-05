import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpHandlerParams, JwtHandlers } from '../http-server'
import { FastifyJwtHandlers } from './fastify-jwt-handlers'

export class FastifyHttpHandlerParams
  implements HttpHandlerParams<FastifyRequest, FastifyReply>
{
  constructor(
    readonly request: FastifyRequest,
    readonly reply: FastifyReply,
  ) {}

  get body(): unknown {
    return this.request.body
  }

  get params(): unknown {
    return this.request.params
  }

  get query(): unknown {
    return this.request.query
  }

  get jwtHandler(): JwtHandlers {
    return new FastifyJwtHandlers(this.request, this.reply)
  }
}
