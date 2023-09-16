import { InMemoryGymsRepository } from '../../../tests/repositories/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms.usecase'
import { Gym } from '../entities/gym.entity'
import { provide } from '@/infra/dependency-inversion/registry'
import { GymDto } from '../dtos/gym-dto.factory'

describe('Search Gyms use case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: SearchGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    provide('gymsRepository', gymsRepository)
    sut = new SearchGymsUseCase()
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.save(
      Gym.create({
        title: 'JavaScript Gym',
        latitude: -27.0747279,
        longitude: -49.4889672,
      }).value as Gym,
    )

    await gymsRepository.save(
      Gym.create({
        title: 'TypeScript Gym',
        latitude: -27.0747279,
        longitude: -49.4889672,
      }).value as Gym,
    )

    const result = await sut.execute({
      page: 1,
      query: 'JavaScript',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).instanceOf(Array)
    const gyms = result.value as GymDto[]
    expect(gyms).toHaveLength(1)
    expect(gyms[0].title).toEqual('JavaScript Gym')
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.save(
        Gym.create({
          title: `JavaScript Gym ${i}`,
          latitude: -27.0747279,
          longitude: -49.4889672,
        }).value as Gym,
      )
    }

    const result = await sut.execute({
      page: 2,
      query: 'JavaScript',
    })

    expect(result.isRight()).toBeTruthy()
    const gyms = result.value as GymDto[]
    expect(gyms).toHaveLength(2)
    expect(gyms[0].title).toEqual('JavaScript Gym 21')
    expect(gyms[1].title).toEqual('JavaScript Gym 22')
  })
})
