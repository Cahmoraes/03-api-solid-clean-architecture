import { Either, EitherType } from '@cahmoraes93/either'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto, GymDtoFactory } from '../dtos/gym-dto.factory'

interface SearchGymsUseCaseInput {
  query: string
  page: number
}

type SearchGymsUseCaseOutput = EitherType<Error, GymDto[]>

export class SearchGymsUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute({
    query,
    page,
  }: SearchGymsUseCaseInput): Promise<SearchGymsUseCaseOutput> {
    const result = await this.performSearchGymUse({ query, page })
    return result.isLeft()
      ? Either.left(result.value)
      : Either.right(result.value)
  }

  private async performSearchGymUse({
    query,
    page,
  }: SearchGymsUseCaseInput): Promise<EitherType<Error, GymDto[]>> {
    try {
      const gyms = await this.gymsRepository.searchMany(query, page)
      return Either.right(gyms.map(GymDtoFactory.create))
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
