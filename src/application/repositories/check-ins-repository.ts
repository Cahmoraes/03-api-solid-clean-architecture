import { CheckIn } from '../entities/check-in.entity'

export interface CheckInsRepository {
  checkInOfId(checkInId: string): Promise<CheckIn | null>
  save(aCheckIn: CheckIn): Promise<CheckIn>
  update(aCheckIn: CheckIn): Promise<CheckIn>
  checkInByUserIdOnDate(userId: string, aDate: Date): Promise<CheckIn | null>
  checkInsByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
}
