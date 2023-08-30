import { DayjsAdapter } from './dayjs-adapter'

describe('DayjsAdapter test suite', () => {
  it('should return true when 2 days are the same', () => {
    const dayjsAdapter = new DayjsAdapter()
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    const date2 = new Date(2022, 0, 20, 8, 0, 0)
    expect(dayjsAdapter.isOnSameDate(date1, date2)).toBe(true)
  })

  it('should return false when 2 days are different', () => {
    const dayjsAdapter = new DayjsAdapter()
    const date1 = new Date(2022, 0, 20, 8, 0, 0)
    const date2 = new Date(2022, 0, 21, 8, 0, 0)
    expect(dayjsAdapter.isOnSameDate(date1, date2)).toBe(false)
  })
})
