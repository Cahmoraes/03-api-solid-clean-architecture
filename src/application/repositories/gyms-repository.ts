import { Gym } from '../entities/gym.entity'

export interface GymsRepository {
  create(aGym: Gym): Promise<Gym>
  gymOfId(anId: string): Promise<Gym | null>
}
