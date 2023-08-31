import ExtendedSet from '@cahmoraes93/extended-set'
import { GymsRepository } from '@/application/repositories/gyms-repository'
import { Gym } from '@/application/entities/gym.entity'
import { Coord } from '@/application/entities/value-objects/coord'
import { DistanceCalculator } from '@/application/entities/distance-calculator.service'

export class InMemoryGymsRepository implements GymsRepository {
  public data: ExtendedSet<Gym> = new ExtendedSet()
  private TEN_KILOMETERS = 10

  async save(aGym: Gym): Promise<Gym> {
    this.data.add(aGym)
    return aGym
  }

  async deleteById(gymId: string): Promise<void> {
    const gym = this.data.find((gym) => gym.id.toString() === gymId)
    if (gym) this.data.delete(gym)
  }

  async gymOfId(anId: string): Promise<Gym | null> {
    return this.data.find((gym) => gym.id.toString() === anId)
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.data
      .filter((gym) => gym.title.includes(query))
      .toArray()
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(aCoord: Coord): Promise<Gym[]> {
    const distanceCalculator = new DistanceCalculator()
    return this.data
      .filter((gym) => {
        const distance = distanceCalculator.calculate(aCoord, gym.coord)
        return distance < this.TEN_KILOMETERS
      })
      .toArray()
  }
}
