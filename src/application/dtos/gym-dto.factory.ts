import { Gym } from '../entities/gym.entity'

export interface GymDto {
  id: string
  title: string
  description?: string | null
  phone?: string | null
  latitude: number
  longitude: number
}

export class GymDtoFactory {
  public static create(aGym: Gym): GymDto {
    return {
      id: aGym.id.toString(),
      title: aGym.title,
      description: aGym.description,
      phone: aGym.phone,
      latitude: aGym.coord.latitude,
      longitude: aGym.coord.longitude,
    }
  }
}
