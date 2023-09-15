import { Either, EitherType } from '@cahmoraes93/either'
import { UserCreateProps } from '../user.entity'
import { Validator } from './validator'

export class UserValidator extends Validator<UserCreateProps> {
  public validate(): EitherType<string[], UserCreateProps> {
    if (!this.props.name) {
      this.addError('Name is required')
    }
    if (!this.props.email) {
      this.addError('Email is required')
    }
    if (!this.props.passwordHash) {
      this.addError('Password is required')
    }
    return this.hasErrors()
      ? Either.left(this.errors)
      : Either.right(this.props)
  }
}
