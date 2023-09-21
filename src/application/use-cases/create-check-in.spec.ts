import { provide } from '@/infra/dependency-inversion/registry'
import { CreateCheckInUseCase } from './create-check-in.usecase'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/tests/repositories/in-memory-gyms-repository'
import { Gym } from '../entities/gym.entity'
import { MaxDistanceReachedError } from '../errors/max-distance-reached.error'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { CheckInDto } from '../dtos/check-in-dto.factory'
import { ValidatorError } from '../entities/errors/validator.error'

describe('CheckIn use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CreateCheckInUseCase
  const userId = 'user-01'
  const gymId = 'gym-01'
  const latitude = -27.2092052
  const longitude = -49.6401091

  beforeEach(async () => {
    vi.useFakeTimers()
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    provide('checkInsRepository', checkInsRepository)
    provide('gymsRepository', gymsRepository)
    sut = new CreateCheckInUseCase()

    const gym = Gym.create(
      {
        title: 'Academia JavaScript Gym',
        description: 'Fake Gym',
        phone: '00-0000-0000',
        latitude,
        longitude,
      },
      gymId,
    ).value as Gym
    await gymsRepository.save(gym)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    await gymsRepository.deleteById(gymId)

    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to check in when gym not exists', async () => {
    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as CheckInDto
    expect(value.gymId.toString()).toEqual(gymId)
    expect(value.userId.toString()).toEqual(userId)
    expect(value.createdAt).instanceOf(Date)
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
    ).value as Gym
    await gymsRepository.save(gym)

    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(MaxDistanceReachedError)
  })

  it('should not be able to check in with a invalid coord', async () => {
    await gymsRepository.deleteById(gymId)

    const result = await sut.execute({
      userId,
      gymId,
      userLatitude: -91,
      userLongitude: 0,
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ValidatorError)
  })
})
