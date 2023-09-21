import { InvalidLongitudeError } from './invalid-longitude.error'

describe('InvalidLatitudeError', () => {
  it('should create a InvalidLongitudeError instance', () => {
    const error = new InvalidLongitudeError()
    expect(error).toBeInstanceOf(InvalidLongitudeError)
    expect(error.message).toBe('Longitude out of range (-180 to 180 degrees)')
  })
})
