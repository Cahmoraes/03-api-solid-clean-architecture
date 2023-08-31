import { DateHelper } from './date-helper'

describe('DateHelper test suite', () => {
  it('should return true when 2 days are the same', () => {
    const dateHelper = new DateHelper()
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    const date2 = new Date(2022, 0, 20, 8, 0, 0)
    expect(dateHelper.isOnSameDate(date1, date2)).toBe(true)
  })

  it('should return false when 2 days are different', () => {
    const dateHelper = new DateHelper()
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    const date2 = new Date(2022, 0, 21, 8, 0, 0)
    expect(dateHelper.isOnSameDate(date1, date2)).toBe(false)
  })
})
