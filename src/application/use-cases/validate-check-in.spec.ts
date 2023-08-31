import { CheckIn } from '../entities/check-in.entity'
import { provide } from '../registry'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../../../tests/repositories/in-memory-gyms-repository'
import { ValidateCheckInUseCase } from './validate-check-in.usecase'

describe('Validate Check-in use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: ValidateCheckInUseCase
  const userId = 'user-01'
  const gymId = 'gym-01'
  const latitude = -27.2092052
  const longitude = -49.6401091

  beforeEach(async () => {
    vi.useFakeTimers()
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    provide('checkInsRepository', checkInsRepository)
    // provide('gymsRepository', gymsRepository)
    sut = new ValidateCheckInUseCase()

    // const gym = Gym.create(
    //   {
    //     title: 'Academia JavaScript Gym',
    //     description: 'Fake Gym',
    //     phone: '00-0000-0000',
    //     latitude,
    //     longitude,
    //   },
    //   gymId,
    // )
    // await gymsRepository.save(gym)
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
    const value = result.value as SuccessResponse<CheckIn>
    expect(value.data?.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.data.toArray()[0].validatedAt).toEqual(
      expect.any(Date),
    )
    expect(value.data?.validatedAt).toEqual(
      checkInsRepository.data.toArray()[0].validatedAt,
    )
  })

  it('should not be able to validate an inexistent check-in', async () => {
    const result = await sut.execute({
      checkInId: 'inexistent-check-in-id',
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value.data).toBe('Resource not found')
  })

  it.only('should not be able to validate the check-in after 20 minutes of its creation', async () => {
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
})
