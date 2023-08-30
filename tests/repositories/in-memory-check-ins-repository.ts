import ExtendedSet from '@cahmoraes93/extended-set'
import { CheckIn } from '@/application/entities/check-in'
import {
  CheckInCreateInput,
  CheckInsRepository,
} from '@/application/repositories/check-ins-repository'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public data: ExtendedSet<CheckIn> = new ExtendedSet()

  async create(aCheckInCreateInput: CheckInCreateInput): Promise<CheckIn> {
    const checkIn = CheckIn.create({
      gymId: new UniqueIdentity(aCheckInCreateInput.gymId),
      userId: new UniqueIdentity(aCheckInCreateInput.userId),
    })
    this.data.add(checkIn)
    return checkIn
  }
}
