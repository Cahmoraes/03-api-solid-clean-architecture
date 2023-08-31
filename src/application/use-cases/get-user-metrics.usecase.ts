import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { inject } from '../registry'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface GetUserMetricsInput {
  userId: string
}

interface Output {
  checkInsCount: number
}

type GetUserMetricsOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<Output>
>

export class GetUserMetrics {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  async execute({
    userId,
  }: GetUserMetricsInput): Promise<GetUserMetricsOutput> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return Either.right(SuccessResponse.ok({ checkInsCount }))
  }
}
