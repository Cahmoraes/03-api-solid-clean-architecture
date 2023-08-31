import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { User } from '@/application/entities/user.entity'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { JwtHandlers } from '../../servers/http-server'

const profileBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type ProfileBodyDto = z.infer<typeof profileBodySchema>
type ProfileControllerOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<User>
>

export class ProfileController {
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
  ): Promise<ProfileControllerOutput> {
    try {
      await jwtHandler.verify()
      const { email, password } = this.parseBodyOrThrow(body)
      return this.authenticateUseCase.execute({ email, password })
    } catch (error) {
      return Either.left(FailResponse.internalServerError(error))
    }
  }

  private parseBodyOrThrow(body: unknown): ProfileBodyDto {
    return profileBodySchema.parse(body)
  }
}
