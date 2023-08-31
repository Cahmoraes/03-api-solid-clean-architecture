import { FastifyReply, FastifyRequest } from 'fastify'
import { TokenService, VerifyUser } from './token.service'

export class FastifyTokenService implements TokenService {
  constructor(
    private request: FastifyRequest,
    private reply: FastifyReply,
  ) {}

  async sign(payload: object, options: object): Promise<string> {
    return this.reply.jwtSign(payload, options)
  }

  async verify(options?: object | undefined): Promise<VerifyUser> {
    await this.request.jwtVerify(options)
    return this.request.user as VerifyUser
  }
}
