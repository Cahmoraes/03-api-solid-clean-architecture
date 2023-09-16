export class UserValidatorError extends Error {
  constructor(message: string[]) {
    super(message.join())
    this.name = 'UserValidatorError'
  }
}
