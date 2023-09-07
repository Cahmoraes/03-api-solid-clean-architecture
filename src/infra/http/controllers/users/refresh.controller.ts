import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials.error'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import {
  TokenGenerator,
  TokenGeneratorProps,
} from '../../servers/fastify/token-generator'

type OutputDTO = {
  token: string
}

type UserControllerOutput = EitherType<
  FailResponse<InvalidCredentialsError>,
  SuccessResponse<OutputDTO>
>

export class RefreshController {
  private tokenGenerator?: TokenGenerator
  private REFRESH_TOKEN_NAME = 'refreshToken'

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    jwtHandler,
    reply,
    request,
  }: FastifyHttpHandlerParams): Promise<UserControllerOutput> {
    try {
      await request.jwtVerify({ onlyCookie: true })
      const tokenGenerator = this.makeTokenGenerator({
        jwtHandler,
        userId: request.user.sub,
        userRole: request.user.role,
      })
      const token = await tokenGenerator.jwtToken()
      const refreshToken = await tokenGenerator.refreshToken()
      await this.configureRefreshToken(refreshToken, reply)
      return Either.right(SuccessResponse.ok({ token }))
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(FailResponse.internalServerError(error))
      }
      throw error
    }
  }

  private makeTokenGenerator(props: TokenGeneratorProps): TokenGenerator {
    if (!this.tokenGenerator) {
      this.tokenGenerator = new TokenGenerator(props)
    }
    return this.tokenGenerator
  }

  private async configureRefreshToken(
    refreshToken: string,
    reply: FastifyHttpHandlerParams['reply'],
  ): Promise<void> {
    this.setCookie(reply, refreshToken)
  }

  private setCookie(
    reply: FastifyHttpHandlerParams['reply'],
    refreshToken: string,
  ): void {
    reply.setCookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
  }
}
