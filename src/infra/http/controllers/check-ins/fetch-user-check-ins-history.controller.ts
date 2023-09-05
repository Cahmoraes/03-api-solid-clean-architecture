import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { FetchUserCheckInsHistoryUseCase } from '@/application/use-cases/fetch-user-check-ins-history.usecase'
import { CheckInDto } from '@/application/dtos/check-in-dto.factory'

const FetchUserCheckInsHistoryParamsSchema = z.object({
  page: z.coerce.number().default(1),
})
type FetchUserCheckInsHistoryParamsDto = z.infer<
  typeof FetchUserCheckInsHistoryParamsSchema
>
type FetchUserCheckInsHistoryControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<CheckInDto[]>
>

export class FetchUserCheckInsHistoryController {
  private readonly fetchUserCheckInsHistoryUseCase =
    inject<FetchUserCheckInsHistoryUseCase>('fetchUserCheckInsHistoryUseCase')

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    params,
    request,
  }: FastifyHttpHandlerParams): Promise<FetchUserCheckInsHistoryControllerOutput> {
    const { page } = this.parseParamsOrThrow(params)
    const userId = request.user.sub
    const result = await this.fetchUserCheckInsHistoryUseCase.execute({
      userId,
      page,
    })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.ok(result.value))
  }

  private parseParamsOrThrow(
    params: unknown,
  ): FetchUserCheckInsHistoryParamsDto {
    return FetchUserCheckInsHistoryParamsSchema.parse(params)
  }
}
