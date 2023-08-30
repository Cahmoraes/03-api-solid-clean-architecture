import dayjs from 'dayjs'
import { DateHelper } from './date-helper'

export class DayjsAdapter implements DateHelper {
  public isOnSameDate(initialDate: Date, targetDate: Date): boolean {
    const startOfTheDay = dayjs(initialDate).startOf('date')
    const endOfTheDay = dayjs(initialDate).endOf('date')
    const targetDateDayJs = dayjs(targetDate)
    return (
      targetDateDayJs.isAfter(startOfTheDay) &&
      targetDateDayJs.isBefore(endOfTheDay)
    )
  }
}
