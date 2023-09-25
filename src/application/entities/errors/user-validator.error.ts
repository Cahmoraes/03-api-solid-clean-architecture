import { ErrorsMap } from '../validators/validator'

export class UserValidatorError extends Error {
  constructor(messages: ErrorsMap) {
    super(UserValidatorError.parse(messages))
    this.name = UserValidatorError.name
  }

  private static parse(messages: ErrorsMap) {
    return this.stringify(this.objectFromEntries(messages))
  }

  private static stringify(anObject: object): string {
    return JSON.stringify(anObject)
  }

  private static objectFromEntries(messages: ErrorsMap): object {
    return Object.fromEntries(messages)
  }
}
