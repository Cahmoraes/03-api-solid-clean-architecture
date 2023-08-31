import { Either, EitherType } from '@cahmoraes93/either'
import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { inject } from '../registry'
import { CheckIn } from '../entities/check-in.entity'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { GymsRepository } from '../repositories/gyms-repository'
import { DistanceCalculator } from '../entities/services/distance-calculator.service'
import { Coord } from '../entities/value-objects/coord'

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
    if (!gym) return Either.left(FailResponse.notFound('Resource not found'))
    if (
      this.distanceBetweenUserAndGymIsMoreThanOneHundredMeters(
        new Coord({ latitude: userLatitude, longitude: userLongitude }),
        gym.coord,
      )
    ) {
      return Either.left(FailResponse.bad('Max distance reached.'))
    }
    if (await this.hasCheckInOnSameDay(userId)) {
      return Either.left(FailResponse.bad('Max number of check-ins reached.'))
    }
    const checkIn = CheckIn.create({
      gymId,
      userId,
    })
    await this.checkInsRepository.save(checkIn)
    return Either.right(SuccessResponse.ok(checkIn))
  }

  private distanceBetweenUserAndGymIsMoreThanOneHundredMeters(
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
