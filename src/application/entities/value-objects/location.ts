import { ValueObject } from '@/core/entities/value-objects/value-object'

export class Location implements ValueObject {
  private readonly _latitude: number
  private readonly _longitude: number

  constructor(latitude: number, longitude: number) {
    this._latitude = latitude
    this._longitude = longitude
  }

  get latitude(): number {
    return this._latitude
  }

  get longitude(): number {
    return this._longitude
  }

  public equals(other: object): boolean {
    if (!(other instanceof Location)) return false
    return (
      other.latitude === this.latitude && other.longitude === this.longitude
    )
  }
}
