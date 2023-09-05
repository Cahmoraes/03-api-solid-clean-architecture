import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'

import {
  GetUserMetricsDto,
  GetUserMetricsUseCase,
} from '@/application/use-cases/get-user-metrics.usecase'

type GetUserMetricsControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<GetUserMetricsDto>
>

export class GetUserMetricsController {
  private readonly getUserMetricsUseCase = inject<GetUserMetricsUseCase>(
    'getUserMetricsUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    request,
  }: FastifyHttpHandlerParams): Promise<GetUserMetricsControllerOutput> {
    const userId = request.user.sub
    const result = await this.getUserMetricsUseCase.execute({
      userId,
    })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.created(result.value))
  }
}
