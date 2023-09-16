import { Coord } from '../value-objects/coord'
import { DistanceCalculator } from './distance-calculator.service'

describe('DistanceCalculator', () => {
  it('calculates distance correctly between two locations', () => {
    const location1 = Coord.create({
      latitude: 40.712776,
      longitude: -74.005974,
    })
    const location2 = Coord.create({
      latitude: 34.052235,
      longitude: -118.243683,
    })
    const calculator = new DistanceCalculator()
    const distance = calculator.calculate(
      location1.value as Coord,
      location2.value as Coord,
    )
    expect(distance).toBe(3935.5562431002922)
  })

  it('should return 0 when locations is the same', () => {
    const location = Coord.create({
      latitude: 40.712776,
      longitude: -74.005974,
    })
    const calculator = new DistanceCalculator()
    const distance = calculator.calculate(
      location.value as Coord,
      location.value as Coord,
    )
    expect(distance).toBe(0)
  })
})
