export class LatitudeError extends Error {
  constructor() {
    super('Latitude out of range (-90 to 90 degrees)')
    this.name = 'LatitudeError'
  }
}
