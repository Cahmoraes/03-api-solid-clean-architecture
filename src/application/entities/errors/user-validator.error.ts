import { ErrorsMap } from '../validators/validator'

export class UserValidatorError extends Error {
  constructor(messages: ErrorsMap) {
    super(UserValidatorError.parse(messages))
    this.name = 'UserValidatorError'
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
