import { Either, EitherType } from '@cahmoraes93/either'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { inject } from '@/infra/dependency-inversion/registry'

interface GetUserMetricsInput {
  userId: string
}

export interface GetUserMetricsDto {
  checkInsCount: number
}

type GetUserMetricsOutput = EitherType<Error, GetUserMetricsDto>

export class GetUserMetricsUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  async execute({
    userId,
  }: GetUserMetricsInput): Promise<GetUserMetricsOutput> {
    const result = await this.performGetUserMetrics({ userId })
    return result.isLeft()
      ? Either.left(result.value)
      : Either.right(result.value)
  }

  private async performGetUserMetrics({
    userId,
  }: GetUserMetricsInput): Promise<EitherType<Error, GetUserMetricsDto>> {
    try {
      const checkInsCount = await this.checkInsRepository.countByUserId(userId)
      return Either.right({ checkInsCount })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
