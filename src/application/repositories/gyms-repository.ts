import { Gym } from '../entities/gym.entity'

export interface GymsRepository {
  save(aGym: Gym): Promise<Gym>
  gymOfId(anId: string): Promise<Gym | null>
  deleteById(gymId: string): Promise<void>
}
