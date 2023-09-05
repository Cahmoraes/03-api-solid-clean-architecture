import { CheckIn } from '../entities/check-in.entity'

export interface CheckInDto {
  id: string
  userId: string
  gymId: string
  createdAt: Date
  validatedAt?: Date | null
}

export class CheckInDtoFactory {
  public static create(aCheckIn: CheckIn): CheckInDto {
    return {
      id: aCheckIn.id.toString(),
      userId: aCheckIn.userId.toString(),
      gymId: aCheckIn.gymId.toString(),
      createdAt: aCheckIn.createdAt,
      validatedAt: aCheckIn.validatedAt,
    }
  }
}
