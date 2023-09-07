import ExtendedSet from '@cahmoraes93/extended-set'
import { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { CheckIn } from '@/application/entities/check-in.entity'
import { DateHelper } from '@/application/entities/services/date-helper'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public data: ExtendedSet<CheckIn> = new ExtendedSet()
  private dateHelper = new DateHelper()

  async checkInOfId(checkInId: string): Promise<CheckIn | null> {
    return this.data.find((checkIn) => checkIn.id.toString() === checkInId)
  }

  async save(aCheckIn: CheckIn): Promise<CheckIn> {
    const existisCheckIn = this.data.find((checkIn) =>
      checkIn.id.equals(aCheckIn.id),
    )
    if (existisCheckIn) {
      this.data.delete(existisCheckIn)
    }
    this.data.add(aCheckIn)
    return aCheckIn
  }

  async update(aCheckIn: CheckIn): Promise<CheckIn> {
    return this.save(aCheckIn)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.data.filter((checkIn) => checkIn.userId.toString() === userId)
      .size
  }

  async checkInByUserIdOnDate(
    userId: string,
    aDate: Date,
  ): Promise<CheckIn | null> {
    return this.data.find(
      (checkIn) =>
        this.dateHelper.isOnSameDate(aDate, checkIn.createdAt) &&
        checkIn.userId.toString() === userId,
    )
  }

  async checkInsByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.data
      .filter((checkIn) => checkIn.userId.toString() === userId)
      .toArray()
      .slice((page - 1) * 20, page * 20)
  }
}
