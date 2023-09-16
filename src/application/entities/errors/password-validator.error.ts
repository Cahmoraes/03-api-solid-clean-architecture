import { ErrorsMap } from '../validators/validator'

export class PasswordValidatorError extends Error {
  constructor(messages: ErrorsMap) {
    super(PasswordValidatorError.parse(messages))
    this.name = 'PasswordValidatorError'
  }

  private static parse(messages: ErrorsMap) {
    return this.stringify(this.objectFromEntries(messages))
  }

  private static objectFromEntries(messages: ErrorsMap) {
    return Object.fromEntries(messages)
  }

  private static stringify(anObject: object) {
    return JSON.stringify(anObject)
  }
}
