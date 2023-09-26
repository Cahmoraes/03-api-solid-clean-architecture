import { Either, EitherType } from '@cahmoraes93/either'
import { CheckIn } from '../entities/check-in.entity'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { GymsRepository } from '../repositories/gyms-repository'
import { DistanceCalculator } from '../entities/services/distance-calculator.service'
import { Coord } from '../entities/value-objects/coord'
import { inject } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { MaxDistanceReachedError } from '../errors/max-distance-reached.error'
import { MaxNumbersOfCheckInsReachedError } from '../errors/max-number-of-check-ins-reached.error'
import { CheckInDto, CheckInDtoFactory } from '../dtos/check-in-dto.factory'
import { InvalidLongitudeError } from '../entities/errors/invalid-longitude.error'
import { InvalidLatitudeError } from '../entities/errors/invalid-latitude.error'
import { ErrorsMap } from '../entities/validators/validator'
import { ValidatorError } from '../entities/errors/validator.error'

export interface CreateCheckInUseCaseInput {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

export type CreateCheckInUseCaseOutput = EitherType<
  | ValidatorError
  | ResourceNotFoundError
  | MaxDistanceReachedError
  | MaxNumbersOfCheckInsReachedError,
  CheckInDto
>

export class CreateCheckInUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')
  private gymsRepository = inject<GymsRepository>('gymsRepository')
  private MAX_DISTANCE_IN_KILOMETERS = 0.1

  public async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CreateCheckInUseCaseInput): Promise<CreateCheckInUseCaseOutput> {
    const coordOrError = Coord.create({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    if (coordOrError.isLeft()) return Either.left(coordOrError.value)
    const gym = await this.gymsRepository.gymOfId(gymId)
    if (!gym) return Either.left(new ResourceNotFoundError())
    if (
      this.distanceBetweenUserAndGymIsGreaterThanOneHundredMeters(
        coordOrError.value,
        gym.coord,
      )
    ) {
      return Either.left(new MaxDistanceReachedError())
    }
    if (await this.hasCheckInOnSameDay(userId)) {
      return Either.left(new MaxNumbersOfCheckInsReachedError())
    }
    const checkIn = CheckIn.create({
      gymId,
      userId,
    })
    await this.checkInsRepository.save(checkIn)
    return Either.right(CheckInDtoFactory.create(checkIn))
  }

  private distanceBetweenUserAndGymIsGreaterThanOneHundredMeters(
    userLocation: Coord,
    gymLocation: Coord,
  ): boolean {
    const distanceCalculator = new DistanceCalculator()
    return (
      distanceCalculator.calculate(userLocation, gymLocation) >
      this.MAX_DISTANCE_IN_KILOMETERS
    )
  }

  private async hasCheckInOnSameDay(userId: string) {
    const result = await this.checkInsRepository.checkInByUserIdOnDate(
      userId,
      new Date(),
    )
    return Boolean(result)
  }
}
