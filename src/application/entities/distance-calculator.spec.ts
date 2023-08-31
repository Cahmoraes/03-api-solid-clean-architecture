import { DistanceCalculator } from './distance-calculator.service'
import { Location } from './value-objects/location'

describe('DistanceCalculator', () => {
  it('calculates distance correctly between two locations', () => {
    const location1 = new Location(40.712776, -74.005974)
    const location2 = new Location(34.052235, -118.243683)
    const calculator = new DistanceCalculator()
    const distance = calculator.calculate(location1, location2)
    expect(distance).toBe(3935.5562431002922) // The expected distance is in kilometers
  })

  it('should return 0 when locations is the same', () => {
    const location = new Location(40.712776, -74.005974)
    const calculator = new DistanceCalculator()
    const distance = calculator.calculate(location, location)
    expect(distance).toBe(0)
  })
})
