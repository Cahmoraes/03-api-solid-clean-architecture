import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { HttpHandlerParams, JwtHandlers } from '../../servers/http-server'
import { UserDto } from '@/application/dtos/user-dto.factory'
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials.error'

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
  }: HttpHandlerParams): Promise<UserControllerOutput> {
    try {
      const { email, password } = this.parseBodyOrThrow(body)
      const result = await this.authenticateUseCase.execute({ email, password })
      if (result.isLeft()) {
        return Either.left(FailResponse.bad(result.value.data))
      }
      const token = await this.createJwtToken(jwtHandler, result.value.data!)
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

  private createJwtToken(jwtHandler: JwtHandlers, user: UserDto) {
    return jwtHandler.sign(
      {},
      {
        sign: {
          sub: user.id.toString(),
        },
      },
    )
  }
}
