import { Gym } from '../entities/gym.entity'
import { Coord } from '../entities/value-objects/coord'

export interface GymsRepository {
  save(aGym: Gym): Promise<Gym>
  deleteById(gymId: string): Promise<void>
  gymOfId(anId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(aCoord: Coord): Promise<Gym[]>
}
