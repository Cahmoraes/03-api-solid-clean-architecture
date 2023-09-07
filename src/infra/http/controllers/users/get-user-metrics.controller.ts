import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials.error'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'

type OutputDTO = {
  checkInsCount: number
}

type MetricsControllerOutput = EitherType<
  FailResponse<InvalidCredentialsError>,
  SuccessResponse<OutputDTO>
>

export class GetUserMetricsController {
  private readonly getUserMetricsUseCase = inject<GetUserMetricsUseCase>(
    'getUserMetricsUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    request,
  }: FastifyHttpHandlerParams): Promise<MetricsControllerOutput> {
    const userId = request.user.sub
    const result = await this.performGetUserMetrics(userId)
    return result.isLeft()
      ? Either.left(FailResponse.bad(result.value))
      : Either.right(SuccessResponse.ok<OutputDTO>(result.value))
  }

  private async performGetUserMetrics(
    userId: string,
  ): Promise<EitherType<Error, { checkInsCount: number }>> {
    try {
      const result = await this.getUserMetricsUseCase.execute({
        userId,
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
