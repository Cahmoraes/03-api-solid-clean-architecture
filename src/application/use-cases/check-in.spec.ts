import { DayjsAdapter } from '@/infra/date/dayjs-adapter'
import { CheckIn } from '../entities/check-in'
import { provide } from '../registry'
import { CheckInUseCase } from './check-in'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'

describe('CheckIn use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    vi.useFakeTimers()
    checkInsRepository = new InMemoryCheckInsRepository(new DayjsAdapter())
    provide('checkInsRepository', checkInsRepository)
    sut = new CheckInUseCase()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const userId = 'user-01'
    const gymId = 'gym-01'
    const result = await sut.execute({
      userId,
      gymId,
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as SuccessResponse<CheckIn>
    expect(value.data?.gymId.toString()).toEqual(gymId)
    expect(value.data?.userId.toString()).toEqual(userId)
  })

  it('should be able to check in', async () => {
    const userId = 'user-01'
    const gymId = 'gym-01'

    const result = await sut.execute({
      userId,
      gymId,
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as SuccessResponse<CheckIn>
    expect(value.data?.gymId.toString()).toEqual(gymId)
    expect(value.data?.userId.toString()).toEqual(userId)
    expect(value.data?.createAt).instanceOf(Date)
  })

  it.only('should not be able to check in twice in the same day', async () => {
    const userId = 'user-01'
    const gymId = 'gym-01'
    const date = new Date(2022, 0, 20, 8, 0, 0)
    vi.setSystemTime(date)

    await sut.execute({
      userId,
      gymId,
    })

    const result = await sut.execute({
      userId,
      gymId,
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should be able to check in twice but in different day', async () => {
    const userId = 'user-01'
    const gymId = 'gym-01'
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    vi.setSystemTime(date1)

    await sut.execute({
      userId,
      gymId,
    })

    const date2 = new Date(2022, 0, 21, 8, 0, 0)
    vi.setSystemTime(date2)

    const result = await sut.execute({
      userId,
      gymId,
    })

    expect(result.isRight()).toBeTruthy()
  })
})
