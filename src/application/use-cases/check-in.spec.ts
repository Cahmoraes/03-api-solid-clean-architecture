import { CheckIn } from '../entities/check-in'
import { provide } from '../registry'
import { CheckInUseCase } from './check-in'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'

describe('CheckIn use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    provide('checkInsRepository', checkInsRepository)
    sut = new CheckInUseCase()
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
  })
})
