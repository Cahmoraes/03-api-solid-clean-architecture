import { CreateGymUseCase } from './create-gym.usecase'
import { InMemoryGymsRepository } from 'tests/repositories/in-memory-gyms-repository'
import { provide } from '@/infra/dependency-inversion/registry'
import { GymDto } from '../dtos/gym-dto.factory'

describe('CreateGym use case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: CreateGymUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    provide('gymsRepository', gymsRepository)
    sut = new CreateGymUseCase()
  })

  it('should create a gym', async () => {
    const result = await sut.execute({
      title: 'Academia TypeScript Gym',
      latitude: -27.0747279,
      longitude: -49.4889672,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    })

    expect(result.isRight()).toBeTruthy()
    const value = result.value as GymDto
    expect(value.title).toEqual('Academia TypeScript Gym')
    expect(value.latitude).toEqual(-27.0747279)
    expect(value.longitude).toEqual(-49.4889672)
    expect(value.description).toEqual('Fake TypeScript Gym')
    expect(value.phone).toEqual('00-0000-0000')
  })

  it('should not be able create gym with invalid coord', async () => {
    const result = await sut.execute({
      title: 'Academia TypeScript Gym',
      latitude: -91,
      longitude: -0,
      description: 'Fake TypeScript Gym',
      phone: '00-0000-0000',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
