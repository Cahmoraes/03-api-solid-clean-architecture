export class MaxNumbersOfCheckInsReachedError extends Error {
  constructor() {
    super('Max numbers of check-ins reached.')
    this.name = 'MaxNumbersOfCheckInsReachedError'
  }
}
