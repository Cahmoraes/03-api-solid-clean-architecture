export class MaxDistanceReachedError extends Error {
  constructor() {
    super('Max distance reached.')
    this.name = 'MaxDistanceReachedError'
  }
}
