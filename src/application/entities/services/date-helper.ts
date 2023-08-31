import dayjs from 'dayjs'

export class DateHelper {
  public disTanceInMinutesFromDate(aDate: Date): number {
    return dayjs(new Date()).diff(aDate, 'minutes')
  }

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
