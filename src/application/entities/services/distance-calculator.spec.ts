import { Coord } from '../value-objects/coord'
import { DistanceCalculator } from './distance-calculator.service'

describe('DistanceCalculator', () => {
  it('calculates distance correctly between two locations', () => {
    const location1 = new Coord({ latitude: 40.712776, longitude: -74.005974 })
    const location2 = new Coord({ latitude: 34.052235, longitude: -118.243683 })
    const calculator = new DistanceCalculator()
    const distance = calculator.calculate(location1, location2)
    expect(distance).toBe(3935.5562431002922)
  })

  it('should return 0 when locations is the same', () => {
    const location = new Coord({ latitude: 40.712776, longitude: -74.005974 })
    const calculator = new DistanceCalculator()
    const distance = calculator.calculate(location, location)
    expect(distance).toBe(0)
  })
})
