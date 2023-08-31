import { Gym } from '../entities/gym.entity'

export interface GymsRepository {
  save(aGym: Gym): Promise<Gym>
  deleteById(gymId: string): Promise<void>
  gymOfId(anId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
}
