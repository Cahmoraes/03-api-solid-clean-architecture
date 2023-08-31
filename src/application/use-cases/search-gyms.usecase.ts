import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { Gym } from '../entities/gym.entity'
import { inject } from '../registry'
import { GymsRepository } from '../repositories/gyms-repository'

interface SearchGymUseCaseInput {
  query: string
  page: number
}

type SearchGymUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<Gym[]>
>

export class SearchGymUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute({
    query,
    page,
  }: SearchGymUseCaseInput): Promise<SearchGymUseCaseOutput> {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return Either.right(SuccessResponse.ok(gyms))
  }
}
