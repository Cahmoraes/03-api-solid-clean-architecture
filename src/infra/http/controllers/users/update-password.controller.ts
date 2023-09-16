import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserDto } from '@/application/dtos/user-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { UpdatePasswordUseCase } from '@/application/use-cases/update-password.usecase'

const updatePasswordSchema = z.object({
  password: z.string().min(6),
})

type updatePasswordDto = z.infer<typeof updatePasswordSchema>

type UpdatePasswordControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<UserDto>
>

export class UpdatePasswordController {
  private readonly updatePasswordUseCase = inject<UpdatePasswordUseCase>(
    'updatePasswordUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    request,
  }: FastifyHttpHandlerParams): Promise<UpdatePasswordControllerOutput> {
    const user = request.user
    const { password } = this.parseBodyOrThrow(request.body)
    const result = await this.performUpdatePassword(user.sub, password)
    return result.isLeft()
      ? Either.left(FailResponse.bad(result.value))
      : Either.right(SuccessResponse.ok(result.value))
  }

  private parseBodyOrThrow(body: unknown): updatePasswordDto {
    return updatePasswordSchema.parse(body)
  }

  private async performUpdatePassword(
    userId: string,
    password: string,
  ): Promise<EitherType<Error | ResourceNotFoundError, UserDto>> {
    try {
      const result = await this.updatePasswordUseCase.execute({
        userId,
        password,
      })
      return result.isLeft()
        ? Either.left(result.value)
        : Either.right(result.value)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
