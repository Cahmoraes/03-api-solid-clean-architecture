import { InvalidLatitudeError } from '../errors/invalid-latitude.error'
import { InvalidLongitudeError } from '../errors/invalid-longitude.error'
import { Coord } from './coord'

describe('Coord test suite', () => {
  const latitude = -27.2092052
  const longitude = -49.6401091

  it('should be able to create a coord', () => {
    const coordOrError = Coord.create({ latitude, longitude })
    const coord = coordOrError.value as Coord
    expect(coord).toBeInstanceOf(Coord)
    expect(coord.latitude).toBe(latitude)
    expect(coord.longitude).toBe(longitude)
  })

  it('should return true when equals is called with different Coord but equals latitude and longitude', () => {
    const coordOrError = Coord.create({ latitude, longitude })
    const coord2OrError = Coord.create({ latitude, longitude })
    const coord = coordOrError.value as Coord
    const coord2 = coord2OrError.value as Coord
    expect(coord.equals(coord2)).toBeTruthy()
  })

  it('should return false when equals is called with different Coord and not equals latitude and longitude', () => {
    const coordOrError = Coord.create({ latitude, longitude })
    const coord2OrError = Coord.create({ latitude, longitude: -45.4568 })
    const coord = coordOrError.value as Coord
    const coord2 = coord2OrError.value as Coord
    expect(coord.equals(coord2)).toBeFalsy()
  })

  it('should return false when equals is called with different Object', () => {
    const coordOrError = Coord.create({ latitude, longitude })
    const differentObject: any = {}
    const coord = coordOrError.value as Coord
    expect(coord.equals(differentObject)).toBeFalsy()
  })

  it('should throw exceptions when trying to create latitude and longitude invalid', () => {
    expect(Coord.create({ latitude: 91, longitude: 0 }).value).toBeInstanceOf(
      InvalidLatitudeError,
    )
    expect(Coord.create({ latitude: -91, longitude: 0 }).value).toBeInstanceOf(
      InvalidLatitudeError,
    )
    expect(Coord.create({ latitude: 0, longitude: 181 }).value).toBeInstanceOf(
      InvalidLongitudeError,
    )
    expect(Coord.create({ latitude: 0, longitude: -181 }).value).toBeInstanceOf(
      InvalidLongitudeError,
    )
  })
})
