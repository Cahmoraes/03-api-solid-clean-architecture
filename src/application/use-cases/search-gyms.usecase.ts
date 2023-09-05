import { Either, EitherType } from '@cahmoraes93/either'
import { Gym } from '../entities/gym.entity'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'

interface SearchGymUseCaseInput {
  query: string
  page: number
}

type SearchGymUseCaseOutput = EitherType<Error, Gym[]>

export class SearchGymUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute({
    query,
    page,
  }: SearchGymUseCaseInput): Promise<SearchGymUseCaseOutput> {
    const result = await this.performSearchGymUse({ query, page })
    return result.isLeft()
      ? Either.left(result.value)
      : Either.right(result.value)
  }

  private async performSearchGymUse({
    query,
    page,
  }: SearchGymUseCaseInput): Promise<EitherType<Error, Gym[]>> {
    try {
      const gyms = await this.gymsRepository.searchMany(query, page)
      return Either.right(gyms)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
