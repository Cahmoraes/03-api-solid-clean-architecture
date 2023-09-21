import { InvalidLatitudeError } from './invalid-latitude.error'

describe('InvalidLatitudeError', () => {
  it('should create a InvalidLatitudeError instance', () => {
    const error = new InvalidLatitudeError()
    expect(error).toBeInstanceOf(InvalidLatitudeError)
    expect(error.message).toBe('Latitude out of range (-90 to 90 degrees)')
  })
})
