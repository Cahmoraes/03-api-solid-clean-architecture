import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { User } from '@/application/entities/user'
import { inject } from '@/application/registry'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type AuthenticateBodyDto = z.infer<typeof authenticateBodySchema>
type UserControllerOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<User>
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

  public async handleRequest(body: unknown): Promise<UserControllerOutput> {
    try {
      const { email, password } = this.parseBodyOrThrow(body)
      return this.authenticateUseCase.execute({ email, password })
    } catch (error) {
      return Either.left(FailResponse.internalServerError(error))
    }
  }

  private parseBodyOrThrow(body: unknown): AuthenticateBodyDto {
    return authenticateBodySchema.parse(body)
  }
}
