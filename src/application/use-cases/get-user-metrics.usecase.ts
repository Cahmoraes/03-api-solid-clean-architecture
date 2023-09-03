import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { inject } from '@/infra/dependency-inversion/registry'

interface GetUserMetricsInput {
  userId: string
}

interface Output {
  checkInsCount: number
}

type GetUserMetricsOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<Output>
>

export class GetUserMetricsUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  async execute({
    userId,
  }: GetUserMetricsInput): Promise<GetUserMetricsOutput> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return Either.right(SuccessResponse.ok({ checkInsCount }))
  }
}
