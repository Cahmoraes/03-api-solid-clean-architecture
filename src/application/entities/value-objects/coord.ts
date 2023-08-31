import { ValueObject } from '@/core/entities/value-objects/value-object'

interface CoordProps {
  latitude: number
  longitude: number
}

export class Coord implements ValueObject {
  private readonly _latitude: number
  private readonly _longitude: number

  constructor(coordProps: CoordProps) {
    this._latitude = coordProps.latitude
    this._longitude = coordProps.longitude
  }

  get latitude(): number {
    return this._latitude
  }

  get longitude(): number {
    return this._longitude
  }

  public equals(other: object): boolean {
    if (!(other instanceof Coord)) return false
    return (
      other.latitude === this.latitude && other.longitude === this.longitude
    )
  }
}
