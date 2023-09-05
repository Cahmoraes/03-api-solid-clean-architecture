import { Either, EitherType } from '@cahmoraes93/either'
import { Coord } from '../entities/value-objects/coord'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto, GymDtoFactory } from '../dtos/gym-dto.factory'

interface FetchNearbyGymsInput {
  userCoord: Coord
}

type FetchNearbyGymsOutput = EitherType<Error, GymDto[]>

export class FetchNearbyGymsUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute({
    userCoord,
  }: FetchNearbyGymsInput): Promise<FetchNearbyGymsOutput> {
    const result = await this.performFetchNearbyGyms(userCoord)
    return result.isLeft()
      ? Either.left(result.value)
      : Either.right(result.value)
  }

  private async performFetchNearbyGyms(
    userCoord: Coord,
  ): Promise<EitherType<Error, GymDto[]>> {
    try {
      const gyms = await this.gymsRepository.findManyNearby(userCoord)
      return Either.right(gyms.map(GymDtoFactory.create))
    } catch (error) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
