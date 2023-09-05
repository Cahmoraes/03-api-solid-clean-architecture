import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { HttpHandlerParams } from '../../servers/http-server'
import { UserDto } from '@/application/dtos/user-dto.factory'

const CreateUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
type CreateUserBodyDto = z.infer<typeof CreateUserBodySchema>
type UserControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<UserDto>
>

export class CreateUserController {
  private readonly createUserUseCase =
    inject<CreateUserUseCase>('createUserUseCase')

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    body,
  }: HttpHandlerParams): Promise<UserControllerOutput> {
    try {
      const userDto = this.parseBodyOrThrow(body)
      const result = await this.createUserUseCase.execute(userDto)
      return result.isLeft()
        ? Either.left(FailResponse.bad(result.value))
        : Either.right(SuccessResponse.created(result.value))
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(FailResponse.internalServerError(error))
      }
      throw error
    }
  }

  private parseBodyOrThrow(body: unknown): CreateUserBodyDto {
    return CreateUserBodySchema.parse(body)
  }
}
