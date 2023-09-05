import { Either, EitherType } from '@cahmoraes93/either'
import { CheckIn } from '../entities/check-in.entity'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { inject } from '@/infra/dependency-inversion/registry'

interface FetchUserCheckInsHistoryInput {
  userId: string
  page: number
}

type FetchUserCheckInsHistoryOutput = EitherType<Error, CheckIn[]>

export class FetchUserCheckInsHistoryUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryInput): Promise<FetchUserCheckInsHistoryOutput> {
    const result = await this.performFetchUserCheckInsHistory({ userId, page })
    return result.isLeft()
      ? Either.left(result.value)
      : Either.right(result.value)
  }

  private async performFetchUserCheckInsHistory({
    userId,
    page,
  }: FetchUserCheckInsHistoryInput): Promise<EitherType<Error, CheckIn[]>> {
    try {
      const checkIns = await this.checkInsRepository.checkInsByUserId(
        userId,
        page,
      )
      return Either.right(checkIns)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
