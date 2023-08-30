import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Location } from './value-objects/location'

interface GymProps {
  title: string
  latitude: number
  longitude: number
  phone?: string
  description?: string
}

type GymInternalProps = Omit<GymProps, 'latitude' | 'longitude'> & {
  location: Location
}

export class Gym extends Entity<GymInternalProps> {
  constructor(props: GymInternalProps, anId?: string | UniqueIdentity) {
    super(props, anId)
  }

  static create(props: GymProps, anId?: string | UniqueIdentity) {
    const { latitude, longitude, ...rest } = props
    return new Gym(
      {
        ...rest,
        location: new Location(latitude, longitude),
      },
      new UniqueIdentity(anId),
    )
  }

  get title(): string {
    return this.props.title
  }

  get description(): string | undefined {
    return this.props.description
  }

  get phone(): string | undefined {
    return this.props.phone
  }

  get location(): Location {
    return this.props.location
  }
}
