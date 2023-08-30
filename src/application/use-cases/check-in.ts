import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { inject } from '../registry'
import { CheckIn } from '../entities/check-in'
import { CheckInsRepository } from '../repositories/check-ins-repository'

export interface CheckInUseCaseInput {
  userId: string
  gymId: string
}

export type CheckInUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<CheckIn>
>

export class CheckInUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  public async execute({
    userId,
    gymId,
  }: CheckInUseCaseInput): Promise<CheckInUseCaseOutput> {
    const checkIn = await this.checkInsRepository.create({ gymId, userId })
    return Either.right(SuccessResponse.ok(checkIn))
  }
}
