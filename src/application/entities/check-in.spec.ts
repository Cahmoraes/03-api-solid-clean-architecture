import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { CheckIn } from './check-in'

describe('CheckIn Entity', () => {
  const userId = new UniqueIdentity('user-01')
  const gymId = new UniqueIdentity('gym-01')

  it('should create a CheckIn', () => {
    const checkIn = CheckIn.create({
      userId,
      gymId,
    })
    expect(checkIn).toBeInstanceOf(CheckIn)
    expect(checkIn.userId.toString()).toEqual(userId.toString())
    expect(checkIn.gymId.toString()).toEqual(gymId.toString())
    expect(checkIn.createAt).toBeInstanceOf(Date)
    expect(checkIn.validatedAt).toBeUndefined()
  })

  it('should create a CheckIn with validatedAt', () => {
    const validatedAt = new Date('2020-01-01')
    const checkIn = CheckIn.create({
      userId,
      gymId,
      validatedAt,
    })
    expect(checkIn).toBeInstanceOf(CheckIn)
    expect(checkIn.userId.toString()).toEqual(userId.toString())
    expect(checkIn.gymId.toString()).toEqual(gymId.toString())
    expect(checkIn.createAt).toBeInstanceOf(Date)
    expect(checkIn.validatedAt).toBeInstanceOf(Date)
    expect(checkIn.validatedAt?.getTime()).toEqual(validatedAt.getTime())
  })
})
