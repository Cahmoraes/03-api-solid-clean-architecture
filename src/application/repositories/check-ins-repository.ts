import { CheckIn } from '../entities/check-in.entity'

export interface CheckInsRepository {
  save(aCheckIn: CheckIn): Promise<CheckIn>
  checkInByUserIdOnDate(userId: string, aDate: Date): Promise<CheckIn | null>
  checkInsByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
}
