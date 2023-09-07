import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { JwtHandlers } from '../../servers/http-server'
import { UserDto } from '@/application/dtos/user-dto.factory'
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials.error'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { TokenGenerator } from '@/application/services/token-generator.service'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type AuthenticateBodyDto = z.infer<typeof authenticateBodySchema>

type OutputDTO = {
  token: string
}

type UserControllerOutput = EitherType<
  FailResponse<InvalidCredentialsError>,
  SuccessResponse<OutputDTO>
>

export class AuthenticateController {
  private REFRESH_TOKEN_NAME = 'refreshToken'
  private readonly authenticateUseCase = inject<AuthenticateUseCase>(
    'authenticateUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    body,
    jwtHandler,
    reply,
  }: FastifyHttpHandlerParams): Promise<UserControllerOutput> {
    try {
      const { email, password } = this.parseBodyOrThrow(body)
      const result = await this.authenticateUseCase.execute({ email, password })
      if (result.isLeft()) {
        return Either.left(FailResponse.bad(result.value))
      }
      const tokenGenerator = new TokenGenerator(
        jwtHandler,
        this.userIdFor(result.value),
      )
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

  private parseBodyOrThrow(body: unknown): AuthenticateBodyDto {
    return authenticateBodySchema.parse(body)
  }

  private userIdFor(aUserDto: UserDto): string {
    return aUserDto.id.toString()
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
