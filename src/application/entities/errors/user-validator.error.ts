export class UserValidatorError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserValidatorError'
  }
}
