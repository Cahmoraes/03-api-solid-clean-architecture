import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Gym, GymInternalProps } from './gym.entity'
import { Coord } from './value-objects/coord'
import { ValidatorError } from './errors/validator.error'

describe('Gym Entity', () => {
  const gymDS = {
    title: 'JavaScript Gym',
    latitude: -27.0747279,
    longitude: -49.4889672,
    description: 'Fake JavaScript Gym',
    phone: '00-0000-0000',
  }

  it('should create a gym', () => {
    const gymOrError = Gym.create(gymDS)
    const gym = gymOrError.value as Gym
    expect(gym).toBeInstanceOf(Gym)
    expect(gym.title).toBe(gymDS.title)
    expect(gym.description).toBe(gymDS.description)
    expect(gym.phone).toBe(gymDS.phone)
    expect(gym.coord).toBeInstanceOf(Coord)
    expect(gym.coord.latitude).toBe(gymDS.latitude)
    expect(gym.coord.longitude).toBe(gymDS.longitude)
    expect(gym.id).toBeInstanceOf(UniqueIdentity)
  })

  it('should restore a gym', () => {
    const gymDto: GymInternalProps = {
      title: gymDS.title,
      description: gymDS.description,
      phone: gymDS.phone,
      coord: Coord.create({
        latitude: gymDS.latitude,
        longitude: gymDS.longitude,
      }).value as Coord,
    }

    const gym = Gym.restore(gymDto, 'uuid')
    expect(gym).toBeInstanceOf(Gym)
    expect(gym.title).toBe(gymDS.title)
    expect(gym.description).toBe(gymDS.description)
    expect(gym.phone).toBe(gymDS.phone)
    expect(gym.coord).toBeInstanceOf(Coord)
    expect(gym.coord.latitude).toBe(gymDS.latitude)
    expect(gym.coord.longitude).toBe(gymDS.longitude)
    expect(gym.id).toBeInstanceOf(UniqueIdentity)
  })

  it('should create a gym with specific ID', () => {
    const specificId = 'gym-01'
    const gym1OrError = Gym.create(gymDS, specificId)
    const gym = gym1OrError.value as Gym
    expect(gym.id.toString()).toBe(specificId)

    const specificUniqueIdentity = new UniqueIdentity(specificId)
    const gym2OrError = Gym.create(gymDS, specificUniqueIdentity)
    const gym2 = gym2OrError.value as Gym
    expect(gym2.id.equals(specificUniqueIdentity)).toBeTruthy()
  })

  it('should return error when create a gym with an invalid coord', () => {
    const gymOrError = Gym.create({
      ...gymDS,
      latitude: 91,
      longitude: 0,
    })
    expect(gymOrError.isLeft()).toBeTruthy()
    const error = gymOrError.value as ValidatorError
    expect(error.message).toEqual(
      '{"latitude":["Number must be less than or equal to 90"]}',
    )
  })
})
