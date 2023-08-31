import ExtendedSet from '@cahmoraes93/extended-set'
import { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { DateHelper } from '@/infra/date/date-helper'
import { CheckIn } from '@/application/entities/check-in.entity'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public data: ExtendedSet<CheckIn> = new ExtendedSet()
  private ITEM_PER_PAGE = 20

  constructor(private dateHelper: DateHelper) {}

  async save(aCheckIn: CheckIn): Promise<CheckIn> {
    this.data.add(aCheckIn)
    return aCheckIn
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
        this.dateHelper.isOnSameDate(aDate, checkIn.createAt) &&
        checkIn.userId.toString() === userId,
    )
  }

  async checkInsByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.data
      .filter((checkIn) => checkIn.userId.toString() === userId)
      .toArray()
      .slice((page - 1) * this.ITEM_PER_PAGE, page * this.ITEM_PER_PAGE)
  }
}
