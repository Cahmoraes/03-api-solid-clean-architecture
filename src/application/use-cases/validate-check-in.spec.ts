import { CheckIn } from '../entities/check-in.entity'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in.usecase'
import { provide } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

describe('Validate Check-in use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: ValidateCheckInUseCase

  beforeEach(async () => {
    vi.useFakeTimers()
    checkInsRepository = new InMemoryCheckInsRepository()
    provide('checkInsRepository', checkInsRepository)
    sut = new ValidateCheckInUseCase()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check-in', async () => {
    const createdCheckIn = CheckIn.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await checkInsRepository.save(createdCheckIn)

    const result = await sut.execute({
      checkInId: createdCheckIn.id.toString(),
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as CheckIn
    expect(value.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.data.toArray()[0].validatedAt).toEqual(
      expect.any(Date),
    )
    expect(value.validatedAt).toEqual(
      checkInsRepository.data.toArray()[0].validatedAt,
    )
  })

  it('should not be able to validate an inexistent check-in', async () => {
    const result = await sut.execute({
      checkInId: 'inexistent-check-in-id',
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = CheckIn.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await checkInsRepository.save(createdCheckIn)

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    const result = await sut.execute({
      checkInId: createdCheckIn.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should not be able to validate the inexistent check-in', async () => {
    const result = await sut.execute({
      checkInId: 'inexistent-check-in-id',
    })
    expect(result.isLeft()).toBeTruthy()
  })
})
