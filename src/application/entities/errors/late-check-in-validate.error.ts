export class LateCheckInValidateError extends Error {
  constructor() {
    super('Late check-in validate error.')
    this.name = 'LateCheckInValidateError'
  }
}
