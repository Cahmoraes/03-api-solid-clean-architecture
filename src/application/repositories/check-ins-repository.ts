import { CheckIn } from '../entities/check-in'

export interface CheckInsRepository {
  create(aCheckIn: CheckIn): Promise<CheckIn>
  checkInByUserIdOnDate(userId: string, aDate: Date): Promise<CheckIn | null>
}
