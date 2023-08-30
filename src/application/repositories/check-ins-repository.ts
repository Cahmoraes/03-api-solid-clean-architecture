import { CheckIn } from '../entities/check-in'

export interface CheckInCreateInput {
  userId: string
  gymId: string
}

export interface CheckInsRepository {
  create(aCheckInCreateInput: CheckInCreateInput): Promise<CheckIn>
  checkInByUserIdOnDate(userId: string, aDate: Date): Promise<CheckIn | null>
}
