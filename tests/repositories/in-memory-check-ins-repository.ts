import ExtendedSet from '@cahmoraes93/extended-set'
import { CheckIn } from '@/application/entities/check-in'
import { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { DateHelper } from '@/infra/date/date-helper'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public data: ExtendedSet<CheckIn> = new ExtendedSet()

  constructor(private dateHelper: DateHelper) {}

  async create(aCheckIn: CheckIn): Promise<CheckIn> {
    this.data.add(aCheckIn)
    return aCheckIn
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
}
