import { Coord } from '../value-objects/coord'

export interface Coordinate {
  latitude: number
  longitude: number
}

function getDistanceBetweenCoordinates(from: Coordinate, to: Coordinate) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  /* c8 ignore start */
  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344

  return dist
}

export class DistanceCalculator {
  calculate(location1: Coord, location2: Coord): number {
    return getDistanceBetweenCoordinates(
      {
        latitude: location1.latitude,
        longitude: location1.longitude,
      },
      {
        latitude: location2.latitude,
        longitude: location2.longitude,
      },
    )
  }
}
