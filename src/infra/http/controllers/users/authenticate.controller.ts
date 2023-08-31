import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { User } from '@/application/entities/user.entity'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { JwtHandlers } from '../../servers/http-server'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type AuthenticateBodyDto = z.infer<typeof authenticateBodySchema>

type OutputDTO = {
  token: string
}

type UserControllerOutput = EitherType<
  FailResponse<unknown>,
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

  public async handleRequest(
    body: unknown,
    _: unknown,
    jwtHandler: JwtHandlers,
  ): Promise<UserControllerOutput> {
    try {
      const { email, password } = this.parseBodyOrThrow(body)
      const result = await this.authenticateUseCase.execute({ email, password })
      if (result.isLeft()) return Either.left(FailResponse.bad(result.value))
      const token = await this.jwtToken(jwtHandler, result.value.data!)
      return Either.right(SuccessResponse.ok({ token }))
    } catch (error) {
      return Either.left(FailResponse.internalServerError(error))
    }
  }

  private parseBodyOrThrow(body: unknown): AuthenticateBodyDto {
    return authenticateBodySchema.parse(body)
  }

  private jwtToken(jwtHandler: JwtHandlers, user: User) {
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
