import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export class DateHelper {
  public distanceInMinutesFromDate(aDate: Date): number {
    return dayjs(new Date()).diff(aDate, 'minutes')
  }

  public isOnSameDate(initialDate: Date, targetDate: Date): boolean {
    const startOfTheDay = dayjs(initialDate).utc().startOf('day')
    const endOfTheDay = dayjs(initialDate).utc().endOf('day')
    const targetDateDayJs = dayjs(targetDate)
    return (
      targetDateDayJs.isAfter(startOfTheDay) &&
      targetDateDayJs.isBefore(endOfTheDay)
    )
  }

  public startOfTheDay(aDate: Date): Date {
    return dayjs(aDate).utc().startOf('day').toDate()
  }

  public endOfTheDay(aDate: Date): Date {
    return dayjs(aDate).utc().endOf('day').toDate()
  }
}
