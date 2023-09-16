import { Either, EitherType } from '@cahmoraes93/either'
import { UserCreateProps } from '../user.entity'
import { Validator } from './validator'
import { z } from 'zod'
import { ValidatorError } from '../errors/validator.error'

const createUserBodySchema = z.object({
  name: z.string().min(6),
  email: z.string().email('Invalid email'),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
})

export class UserValidator extends Validator<UserCreateProps> {
  public validate(): EitherType<ValidatorError, UserCreateProps> {
    const result = createUserBodySchema.safeParse(this.props)
    if (!result.success) this.formatErrors(result)
    return this.hasErrors()
      ? Either.left(new ValidatorError(this.stringifyErrors))
      : Either.right(this.props)
  }

  protected formatErrors(parseSafeResult: z.SafeParseError<UserCreateProps>) {
    const entries = Object.entries(parseSafeResult.error.flatten().fieldErrors)
    for (const [field, errors] of entries) {
      this.addError(field, errors)
    }
  }
}
