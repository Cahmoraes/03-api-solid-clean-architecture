import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Coord } from './value-objects/coord'

interface GymProps {
  title: string
  latitude: number
  longitude: number
  phone?: string | null
  description?: string | null
}

type GymInternalProps = Omit<GymProps, 'latitude' | 'longitude'> & {
  coord: Coord
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
        coord: new Coord({ latitude, longitude }),
      },
      new UniqueIdentity(anId),
    )
  }

  get title(): string {
    return this.props.title
  }

  get description(): string | null | undefined {
    return this.props.description
  }

  get phone(): string | undefined | null {
    return this.props.phone
  }

  get coord(): Coord {
    return this.props.coord
  }
}
