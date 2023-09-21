import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Coord } from './value-objects/coord'
import { Either, EitherType } from '@cahmoraes93/either'
import type { ValidatorError } from './errors/validator.error'

interface GymProps {
  title: string
  latitude: number
  longitude: number
  phone?: string | null
  description?: string | null
}

export type GymInternalProps = Omit<GymProps, 'latitude' | 'longitude'> & {
  coord: Coord
}

export class Gym extends Entity<GymInternalProps> {
  constructor(props: GymInternalProps, anId?: string | UniqueIdentity) {
    super(props, anId)
  }

  static create(
    props: GymProps,
    anId?: string | UniqueIdentity,
  ): EitherType<ValidatorError, Gym> {
    const { latitude, longitude, ...rest } = props
    const coordOrError = Coord.create({ latitude, longitude })
    if (coordOrError.isLeft()) return Either.left(coordOrError.value)
    const gym = new Gym(
      {
        ...rest,
        coord: coordOrError.value,
      },
      new UniqueIdentity(anId),
    )
    return Either.right(gym)
  }

  static restore(props: GymInternalProps, anId: string) {
    return new Gym(props, anId)
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
