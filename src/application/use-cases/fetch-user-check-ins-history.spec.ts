import { CheckIn } from '../entities/check-in.entity'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../../../tests/repositories/in-memory-gyms-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history.usecase'
import { provide } from '@/infra/dependency-inversion/registry'
import { CheckInDto, CheckInDtoFactory } from '../dtos/check-in-dto.factory'

describe('Fetch User Check-in history use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: FetchUserCheckInsHistoryUseCase
  const userId = 'user-01'

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    provide('checkInsRepository', checkInsRepository)
    provide('gymsRepository', gymsRepository)
    sut = new FetchUserCheckInsHistoryUseCase()
  })

  it('should be able to fetch check-in history', async () => {
    const checkIn1 = await checkInsRepository.save(
      CheckIn.create({
        userId,
        gymId: 'gym-01',
      }),
    )
    const checkIn2 = await checkInsRepository.save(
      CheckIn.create({
        userId,
        gymId: 'gym-02',
      }),
    )
    const result = await sut.execute({
      userId,
      page: 1,
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as CheckInDto[]
    expect(value).toHaveLength(2)
    expect(value).toEqual([
      CheckInDtoFactory.create(checkIn1),
      CheckInDtoFactory.create(checkIn2),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.save(
        CheckIn.create({
          userId,
          gymId: `gym-${i}`,
        }),
      )
    }

    const result = await sut.execute({
      userId,
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    const value = result.value as CheckInDto[]
    expect(value).toHaveLength(2)
  })
})
