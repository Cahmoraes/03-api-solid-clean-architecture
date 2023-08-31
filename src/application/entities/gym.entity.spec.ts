import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Gym } from './gym.entity'
import { Coord } from './value-objects/coord'

describe('Gym Entity', () => {
  const gymDS = {
    title: 'JavaScript Gym',
    latitude: -27.0747279,
    longitude: -49.4889672,
    description: 'Fake JavaScript Gym',
    phone: '00-0000-0000',
  }

  it('should create a gym', () => {
    const gym = Gym.create(gymDS)
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
    const gym1 = Gym.create(gymDS, specificId)
    expect(gym1.id.toString()).toBe(specificId)

    const specificUniqueIdentity = new UniqueIdentity(specificId)
    const gym2 = Gym.create(gymDS, specificUniqueIdentity)
    expect(gym2.id.equals(specificUniqueIdentity)).toBeTruthy()
  })
})
