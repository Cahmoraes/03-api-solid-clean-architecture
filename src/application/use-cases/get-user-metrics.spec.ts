import { CheckIn } from '../entities/check-in.entity'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics.usecase'
import { provide } from '@/infra/dependency-inversion/registry'

describe('Get User Metrics use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase
  const userId = 'user-01'

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    provide('checkInsRepository', checkInsRepository)
    sut = new GetUserMetricsUseCase()
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.save(
      CheckIn.create({
        userId,
        gymId: 'gym-01',
      }),
    )
    await checkInsRepository.save(
      CheckIn.create({
        userId,
        gymId: 'gym-02',
      }),
    )
    const result = await sut.execute({
      userId,
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({ checkInsCount: 2 })
  })
})
