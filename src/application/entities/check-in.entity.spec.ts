import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { CheckIn } from './check-in.entity'
import { Either } from '@cahmoraes93/either'
import { LateCheckInValidateError } from './errors/late-check-in-validate.error'

describe('CheckIn Entity', () => {
  const userId = 'user-01'
  const gymId = 'gym-01'

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('should create a check-in with specific ID', () => {
    const specificId = 'check-in-01'
    const checkIn1 = CheckIn.create(
      {
        userId,
        gymId,
      },
      specificId,
    )
    expect(checkIn1.id.toString()).toBe(specificId)

    const specificUniqueIdentity = new UniqueIdentity(specificId)
    const checkIn2 = CheckIn.create(
      {
        userId,
        gymId,
      },
      specificUniqueIdentity,
    )
    expect(checkIn2.id.equals(specificUniqueIdentity)).toBeTruthy()
  })

  it('should validate check-in', () => {
    const checkIn = CheckIn.create({
      userId,
      gymId,
    })

    const result = checkIn.validate()
    expect(result.isRight()).toBeTruthy()
  })

  it('should not validate check-in when passed 20 minutes after creation', () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
    const checkIn = CheckIn.create({
      userId,
      gymId,
    })

    const TWENTY_ONE_MINUTES = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES)
    const result = checkIn.validate()
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(LateCheckInValidateError)
  })
})
