import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { Gym } from '../entities/gym.entity'
import { Coord } from '../entities/value-objects/coord'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'

interface FetchNearbyGymsInput {
  userCoord: Coord
}

type FetchNearbyGymsOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<Gym[]>
>

export class FetchNearbyGymsUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute({
    userCoord,
  }: FetchNearbyGymsInput): Promise<FetchNearbyGymsOutput> {
    const gyms = await this.gymsRepository.findManyNearby(userCoord)
    return Either.right(SuccessResponse.ok(gyms))
  }
}
