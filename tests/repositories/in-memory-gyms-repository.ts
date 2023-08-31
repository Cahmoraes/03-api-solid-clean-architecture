import ExtendedSet from '@cahmoraes93/extended-set'
import { GymsRepository } from '@/application/repositories/gyms-repository'
import { Gym } from '@/application/entities/gym.entity'
import { itemsPerPage } from '@/core/helpers/items-per-page'

export class InMemoryGymsRepository implements GymsRepository {
  public data: ExtendedSet<Gym> = new ExtendedSet()

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
      .slice(...itemsPerPage(page))
  }
}
