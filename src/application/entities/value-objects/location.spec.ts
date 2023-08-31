import { Location } from './location'

describe('Location test suite', () => {
  const latitude = -27.2092052
  const longitude = -49.6401091

  it('should be able to create a location', () => {
    const location = new Location(latitude, longitude)
    expect(location).toBeInstanceOf(Location)
    expect(location.latitude).toBe(latitude)
    expect(location.longitude).toBe(longitude)
  })

  it('should return true when equals is called with different Location but equals latitude and longitude', () => {
    const location = new Location(latitude, longitude)
    const location2 = new Location(latitude, longitude)
    expect(location.equals(location2)).toBeTruthy()
  })

  it('should return false when equals is called with different Location and not equals latitude and longitude', () => {
    const location = new Location(latitude, longitude)
    const location2 = new Location(latitude, -45.4568)
    expect(location.equals(location2)).toBeFalsy()
  })

  it('should return false when equals is called with different Object', () => {
    const location = new Location(latitude, longitude)
    const differentObject: any = {}
    expect(location.equals(differentObject)).toBeFalsy()
  })
})
