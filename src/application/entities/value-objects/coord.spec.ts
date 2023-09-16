import type { ErrorsMap } from '../validators/validator'
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
    const coordOrErrorLatitude = Coord.create({ latitude: 91, longitude: 0 })
    expect(coordOrErrorLatitude.isLeft()).toBeTruthy()
    const coordErrorLatitude = coordOrErrorLatitude.value as ErrorsMap
    expect(coordErrorLatitude.get('latitude')).toEqual([
      'Number must be less than or equal to 90',
    ])

    const coordOrErrorLatitude2 = Coord.create({ latitude: -91, longitude: 0 })
    expect(coordOrErrorLatitude2.isLeft()).toBeTruthy()
    const coordErrorLatitude2 = coordOrErrorLatitude2.value as ErrorsMap
    expect(coordErrorLatitude2.get('latitude')).toEqual([
      'Number must be greater than or equal to -90',
    ])

    const coordOrErrorLongitude = Coord.create({ latitude: 0, longitude: 181 })
    expect(coordOrErrorLongitude.isLeft()).toBeTruthy()
    const coordErrorLongitude = coordOrErrorLongitude.value as ErrorsMap
    expect(coordErrorLongitude.get('longitude')).toEqual([
      'Number must be less than or equal to 180',
    ])

    const coordOrErrorLongitude2 = Coord.create({
      latitude: 0,
      longitude: -181,
    })
    expect(coordOrErrorLongitude2.isLeft()).toBeTruthy()
    const coordErrorLongitude2 = coordOrErrorLongitude2.value as ErrorsMap
    expect(coordErrorLongitude2.get('longitude')).toEqual([
      'Number must be greater than or equal to -180',
    ])
  })
})
