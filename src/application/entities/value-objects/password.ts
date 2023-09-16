import * as bcrypt from 'bcrypt'
import { PasswordValidator } from '../validators/password.validator'
import { Either, EitherType } from '@cahmoraes93/either'
import { ErrorsMap } from '../validators/validator'
import { PasswordValidatorError } from '../errors/password-validator.error'
import { ValidatorError } from '../errors/validator.error'

type PasswordDto = { password: string }

export class Password {
  private readonly _value: string

  private constructor(aString: string) {
    this._value = aString
  }

  static async create(
    aString: string,
  ): Promise<EitherType<ValidatorError, Password>> {
    const passwordOrError = this.validate(aString)
    if (passwordOrError.isLeft()) {
      return Either.left(passwordOrError.value)
    }
    const passwordHashed = await this.createHash(aString)
    const password = new Password(passwordHashed)
    return Either.right(password)
  }

  private static validate(
    aString: string,
  ): EitherType<ValidatorError, PasswordDto> {
    const passwordValidator = new PasswordValidator({
      password: aString,
    })
    return passwordValidator.validate()
  }

  static restore(aHash: string): Password {
    return new Password(aHash)
  }

  private static async createHash(password: string): Promise<string> {
    return bcrypt.hash(password, await this.generateSalt())
  }

  private static async generateSalt(): Promise<string> {
    return bcrypt.genSalt()
  }

  public async compare(aString: string): Promise<boolean> {
    return bcrypt.compare(aString, this._value)
  }

  public toString() {
    return this._value
  }
}
