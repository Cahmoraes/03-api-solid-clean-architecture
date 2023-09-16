import { Either, EitherType } from '@cahmoraes93/either'
import { Coord } from '../entities/value-objects/coord'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto, GymDtoFactory } from '../dtos/gym-dto.factory'
import type { ErrorsMap } from '../entities/validators/validator'

interface FetchNearbyGymsInput {
  latitude: number
  longitude: number
}

type FetchNearbyGymsOutput = EitherType<ErrorsMap | Error, GymDto[]>

export class FetchNearbyGymsUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute({
    latitude,
    longitude,
  }: FetchNearbyGymsInput): Promise<FetchNearbyGymsOutput> {
    const coordOrError = Coord.create({ latitude, longitude })
    if (coordOrError.isLeft()) return Either.left(coordOrError.value)
    const result = await this.performFetchNearbyGyms(coordOrError.value)
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
