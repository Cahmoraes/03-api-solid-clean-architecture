import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { HttpHandlerParams } from '../../servers/http-server'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials.error'

const GetUserMetricsBodySchema = z.object({
  userId: z.string(),
})
type GetUserMetricsBodyDto = z.infer<typeof GetUserMetricsBodySchema>

type OutputDTO = {
  metrics: number
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
    body,
    jwtHandler,
  }: HttpHandlerParams): Promise<MetricsControllerOutput> {
    try {
      await jwtHandler.verify()
      const { userId } = this.parseBodyOrThrow(body)
      const result = await this.getUserMetricsUseCase.execute({
        userId,
      })
      if (result.isLeft()) {
        return Either.left(FailResponse.bad(result.value.data))
      }
      return Either.right(
        SuccessResponse.ok<OutputDTO>({
          metrics: result.value.data.checkInsCount,
        }),
      )
    } catch (error: any) {
      return Either.left(FailResponse.internalServerError(error))
    }
  }

  private parseBodyOrThrow(body: unknown): GetUserMetricsBodyDto {
    return GetUserMetricsBodySchema.parse(body)
  }
}
