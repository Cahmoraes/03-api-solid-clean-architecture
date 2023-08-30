import { Gym } from '../entities/gym'

export interface GymCreateInput {
  title: string
  latitude: number
  longitude: number
  phone?: string
  description?: string
}

export interface GymsRepository {
  gymOfId(anId: string): Promise<Gym | null>
}
