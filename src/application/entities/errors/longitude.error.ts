export class LongitudeError extends Error {
  constructor() {
    super('Longitude out of range (-180 to 180 degrees)')
    this.name = 'LongitudeError'
  }
}
