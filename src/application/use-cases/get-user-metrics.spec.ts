import { DayjsAdapter } from '@/infra/date/dayjs-adapter'
import { CheckIn } from '../entities/check-in.entity'
import { provide } from '../registry'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { InMemoryCheckInsRepository } from 'tests/repositories/in-memory-check-ins-repository'
import { GetUserMetrics } from './get-user-metrics.usecase'

describe('Get User Metrics use case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetUserMetrics
  const userId = 'user-01'

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository(new DayjsAdapter())
    provide('checkInsRepository', checkInsRepository)
    sut = new GetUserMetrics()
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
    expect(result.value).toEqual(SuccessResponse.ok({ checkInsCount: 2 }))
  })
})
