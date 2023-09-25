export class InvalidLatitudeError extends Error {
  constructor() {
    super('Latitude out of range (-90 to 90 degrees)')
    this.name = InvalidLatitudeError.name
  }
}
