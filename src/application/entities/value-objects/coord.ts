import { ValueObject } from '@/core/entities/value-objects/value-object'
import { InvalidLatitudeError } from '../errors/invalid-latitude.error'
import { InvalidLongitudeError } from '../errors/invalid-longitude.error'
import { Either, EitherType } from '@cahmoraes93/either'
import { CoordValidator } from '../validators/coord.validator'
import type { ValidatorError } from '../errors/validator.error'

interface CoordProps {
  latitude: number
  longitude: number
}

export class Coord implements ValueObject {
  private readonly _latitude: number
  private readonly _longitude: number

  private constructor(coordProps: CoordProps) {
    this._latitude = coordProps.latitude
    this._longitude = coordProps.longitude
  }

  public static create(
    coordProps: CoordProps,
  ): EitherType<ValidatorError, Coord> {
    const coordOrError = this.validate(coordProps)
    if (coordOrError.isLeft()) return Either.left(coordOrError.value)
    const coord = new Coord(coordProps)
    return Either.right(coord)
  }

  public static restore(coordProps: CoordProps): Coord {
    return new Coord(coordProps)
  }

  private static validate(
    coordProps: CoordProps,
  ): EitherType<ValidatorError, CoordProps> {
    const coordValidator = new CoordValidator(coordProps)
    return coordValidator.validate()
  }

  private static validateCoords(
    coordProps: CoordProps,
  ): EitherType<InvalidLongitudeError | InvalidLatitudeError, null> {
    try {
      this.validateLatitude(coordProps.latitude)
      this.validateLongitude(coordProps.longitude)
      return Either.right(null)
    } catch (error) {
      if (error instanceof Error) return Either.left(error)
      throw error
    }
  }

  private static validateLatitude(latitude: number) {
    if (latitude < -90 || latitude > 90) throw new InvalidLatitudeError()
  }

  private static validateLongitude(longitude: number) {
    if (longitude < -180 || longitude > 180) throw new InvalidLongitudeError()
  }

  public get latitude(): number {
    return this._latitude
  }

  public get longitude(): number {
    return this._longitude
  }

  public equals(other: object): boolean {
    if (!(other instanceof Coord)) return false
    return (
      other.latitude === this.latitude && other.longitude === this.longitude
    )
  }
}
