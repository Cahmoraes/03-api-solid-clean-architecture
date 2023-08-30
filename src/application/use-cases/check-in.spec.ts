import { DayjsAdapter } from '@/infra/date/dayjs-adapter'
import { CheckIn } from '../entities/check-in'
import { provide } from '../registry'
import { CheckInUseCase } from './check-in'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../../../tests/repositories/in-memory-gyms-repository'
import { Gym } from '../entities/gym'

describe('CheckIn use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInUseCase
  const userId = 'user-01'
  const gymId = 'gym-01'
  const latitude = -27.2092052
  const longitude = -49.6401091

  beforeEach(() => {
    vi.useFakeTimers()
    checkInsRepository = new InMemoryCheckInsRepository(new DayjsAdapter())
    gymsRepository = new InMemoryGymsRepository()
    provide('checkInsRepository', checkInsRepository)
    provide('gymsRepository', gymsRepository)
    sut = new CheckInUseCase()

    const gym = Gym.create(
      {
        title: 'Academia JavaScript Gym',
        description: 'Fake Gym',
        phone: '00-0000-0000',
        latitude,
        longitude,
      },
      gymId,
    )
    gymsRepository.data.add(gym)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as SuccessResponse<CheckIn>
    expect(value.data?.gymId.toString()).toEqual(gymId)
    expect(value.data?.userId.toString()).toEqual(userId)
    expect(value.data?.createAt).instanceOf(Date)
  })

  it('should not be able to check in twice in the same day', async () => {
    const date = new Date(2022, 0, 20, 8, 0, 0)
    vi.setSystemTime(date)

    await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should be able to check in twice but in different day', async () => {
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    vi.setSystemTime(date1)

    await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    const date2 = new Date(2022, 0, 21, 8, 0, 0)
    vi.setSystemTime(date2)

    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able to check in on distant gym', async () => {
    const gymId = 'gym-02'
    const gym = Gym.create(
      {
        title: 'Academia TypeScript Gym',
        description: 'Fake TypeScript Gym',
        phone: '00-0000-0000',
        latitude: -27.0747279,
        longitude: -49.4889672,
      },
      gymId,
    )
    gymsRepository.data.add(gym)

    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    expect(result.isLeft()).toBeTruthy()
  })
})
