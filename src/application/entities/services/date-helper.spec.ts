import { DateHelper } from './date-helper'

describe('DateHelper test suite', () => {
  let dateHelper: DateHelper

  beforeEach(() => {
    dateHelper = new DateHelper()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return true when 2 days are the same', () => {
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    const date2 = new Date(2022, 0, 20, 8, 0, 0)
    expect(dateHelper.isOnSameDate(date1, date2)).toBe(true)
  })

  it('should return false when 2 days are different', () => {
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    const date2 = new Date(2022, 0, 21, 8, 0, 0)
    expect(dateHelper.isOnSameDate(date1, date2)).toBe(false)
  })

  it('should return start of date', () => {
    const date = new Date(2023, 0, 1, 13, 40)
    const startOfDay = dateHelper.startOfTheDay(date)
    expect(startOfDay).toEqual(new Date('2023-01-01T03:00:00.000Z'))
  })

  it('should return end of date', () => {
    const date = new Date(2023, 0, 1, 13, 40)
    const startOfDay = dateHelper.endOfTheDay(date)
    expect(startOfDay).toEqual(new Date('2023-01-02T02:59:59.999Z'))
  })

  it('should return distance in minutes', () => {
    const date = new Date(2022, 0, 20, 8, 0, 0)
    vi.setSystemTime(date)
    vi.advanceTimersByTime(1000 * 60 * 60)
    expect(dateHelper.distanceInMinutesFromDate(date)).toBe(60)
  })
})
