import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { User } from '@/application/entities/user'
import { inject } from '@/application/registry'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
type RegisterBodyDto = z.infer<typeof registerBodySchema>
type UserControllerOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<User>
>

export class CreateUserController {
  private readonly createUserUseCase =
    inject<CreateUserUseCase>('createUserUseCase')

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest(body: unknown): Promise<UserControllerOutput> {
    try {
      const { name, email, password } = this.parseBodyOrThrow(body)
      return this.createUserUseCase.execute({ name, email, password })
    } catch (error) {
      return Either.left(FailResponse.internalServerError(error))
    }
  }

  private parseBodyOrThrow(body: unknown): RegisterBodyDto {
    return registerBodySchema.parse(body)
  }
}
