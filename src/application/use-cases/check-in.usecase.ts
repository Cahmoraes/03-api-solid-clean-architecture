import { Either, EitherType } from '@cahmoraes93/either'
import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { inject } from '../registry'
import { CheckIn } from '../entities/check-in.entity'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { GymsRepository } from '../repositories/gyms-repository'
import { DistanceCalculator } from '../entities/distance-calculator.service'
import { Location } from '../entities/value-objects/location'

export interface CheckInUseCaseInput {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

export type CheckInUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<CheckIn>
>

export class CheckInUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')
  private gymsRepository = inject<GymsRepository>('gymsRepository')
  private MAX_DISTANCE_IN_KILOMETERS = 0.1

  public async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseInput): Promise<CheckInUseCaseOutput> {
    const gym = await this.gymsRepository.gymOfId(gymId)
    if (!gym) {
      return Either.left(FailResponse.notFound('Resource not found'))
    }

    if (
      this.distanceBetweenUserAndGymIsMoreThanOneHundredMeters(
        new Location(userLatitude, userLongitude),
        gym.location,
      )
    ) {
      return Either.left(FailResponse.bad('User is too far from gym'))
    }

    const checkInOnSameDay =
      await this.checkInsRepository.checkInByUserIdOnDate(userId, new Date())
    if (checkInOnSameDay) {
      return Either.left(FailResponse.bad('Already checked in'))
    }
    const checkIn = CheckIn.create({
      gymId,
      userId,
    })
    await this.checkInsRepository.save(checkIn)
    return Either.right(SuccessResponse.ok(checkIn))
  }

  private distanceBetweenUserAndGymIsMoreThanOneHundredMeters(
    userLocation: Location,
    gymLocation: Location,
  ): boolean {
    const distanceCalculator = new DistanceCalculator()
    return (
      distanceCalculator.calculate(userLocation, gymLocation) >
      this.MAX_DISTANCE_IN_KILOMETERS
    )
  }
}
