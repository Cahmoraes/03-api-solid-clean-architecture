import { Coord } from './coord'

describe('Coord test suite', () => {
  const latitude = -27.2092052
  const longitude = -49.6401091

  it('should be able to create a coord', () => {
    const coord = new Coord({ latitude, longitude })
    expect(coord).toBeInstanceOf(Coord)
    expect(coord.latitude).toBe(latitude)
    expect(coord.longitude).toBe(longitude)
  })

  it('should return true when equals is called with different Coord but equals latitude and longitude', () => {
    const coord = new Coord({ latitude, longitude })
    const coord2 = new Coord({ latitude, longitude })
    expect(coord.equals(coord2)).toBeTruthy()
  })

  it('should return false when equals is called with different Coord and not equals latitude and longitude', () => {
    const coord = new Coord({ latitude, longitude })
    const coord2 = new Coord({ latitude, longitude: -45.4568 })
    expect(coord.equals(coord2)).toBeFalsy()
  })

  it('should return false when equals is called with different Object', () => {
    const coord = new Coord({ latitude, longitude })
    const differentObject: any = {}
    expect(coord.equals(differentObject)).toBeFalsy()
  })
})
