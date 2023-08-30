import { CheckIn } from '../entities/check-in'

export interface CheckInCreateInput {
  userId: string
  gymId: string
}

export interface CheckInsRepository {
  // checkInOfId(anId: string): Promise<CheckIn | null>
  create(aCheckInCreateInput: CheckInCreateInput): Promise<CheckIn>
}
