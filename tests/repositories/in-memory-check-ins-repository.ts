import ExtendedSet from '@cahmoraes93/extended-set'
import { CheckIn } from '@/application/entities/check-in'
import {
  CheckInCreateInput,
  CheckInsRepository,
} from '@/application/repositories/check-ins-repository'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { DateHelper } from '@/infra/date/date-helper'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public data: ExtendedSet<CheckIn> = new ExtendedSet()

  constructor(private dateHelper: DateHelper) {}

  async create(aCheckInCreateInput: CheckInCreateInput): Promise<CheckIn> {
    const checkIn = CheckIn.create({
      gymId: new UniqueIdentity(aCheckInCreateInput.gymId),
      userId: new UniqueIdentity(aCheckInCreateInput.userId),
    })
    this.data.add(checkIn)
    return checkIn
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
