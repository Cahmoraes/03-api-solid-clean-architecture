import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserDto } from '@/application/dtos/user-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { GetUserProfileUseCase } from '@/application/use-cases/get-user-profile.usecase'

type GetUserProfileControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<UserDto>
>

export class GetUserProfileController {
  private readonly getUserProfileUseCase = inject<GetUserProfileUseCase>(
    'getUserProfileUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    request,
  }: FastifyHttpHandlerParams): Promise<GetUserProfileControllerOutput> {
    try {
      const user = request.user
      const result = await this.getUserProfileUseCase.execute({
        userId: user.sub,
      })
      return result.isLeft()
        ? Either.left(FailResponse.bad(result.value))
        : Either.right(SuccessResponse.ok(result.value))
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(FailResponse.internalServerError(error))
      }
      throw error
    }
  }
}
