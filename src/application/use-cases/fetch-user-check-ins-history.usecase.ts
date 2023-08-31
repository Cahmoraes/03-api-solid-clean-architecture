import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { CheckIn } from '../entities/check-in.entity'
import { inject } from '../registry'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface FetchUserCheckInsHistoryInput {
  userId: string
  page: number
}

type FetchUserCheckInsHistoryOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<CheckIn[]>
>

export class FetchUserCheckInsHistoryUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryInput): Promise<FetchUserCheckInsHistoryOutput> {
    const checkIns = await this.checkInsRepository.checkInsByUserId(
      userId,
      page,
    )
    return Either.right(SuccessResponse.ok(checkIns))
  }
}
