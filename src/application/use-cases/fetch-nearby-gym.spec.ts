import { provide } from '../registry'
import { InMemoryGymsRepository } from '@/tests/repositories/in-memory-gyms-repository'
import { Gym } from '../entities/gym.entity'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gym.usecase'
import { Coord } from '../entities/value-objects/coord'

describe('Fetch Nearby Gyms use case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: FetchNearbyGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    provide('gymsRepository', gymsRepository)
    sut = new FetchNearbyGymsUseCase()
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.save(
      Gym.create({
        title: 'Near Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
    )

    await gymsRepository.save(
      Gym.create({
        title: 'Far Gym',
        latitude: -27.0610928,
        longitude: -49.5229501,
      }),
    )

    const userCoord = new Coord({
      latitude: -27.2092052,
      longitude: -49.6401091,
    })
    const result = await sut.execute({ userCoord })
    expect(result.isRight()).toBeTruthy()
    const gyms = result.value.data as Gym[]
    expect(gyms).toHaveLength(1)
    expect(gyms[0].title).toEqual('Near Gym')
  })
})
