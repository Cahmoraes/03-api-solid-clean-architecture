import { Either, EitherType } from '@cahmoraes93/either'
import { UserCreateProps } from '../user.entity'
import { ErrorsMap, Validator } from './validator'
import { z } from 'zod'

const createUserBodySchema = z.object({
  name: z.string().min(6),
  email: z.string().email('Invalid email'),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
})

export class UserValidator extends Validator<UserCreateProps> {
  public validate(): EitherType<ErrorsMap, UserCreateProps> {
    const result = createUserBodySchema.safeParse(this.props)
    if (!result.success) this.formatErrors(result)
    return this.hasErrors()
      ? Either.left(this.errors)
      : Either.right(this.props)
  }

  private formatErrors(parseSafeResult: z.SafeParseError<UserCreateProps>) {
    const entries = Object.entries(parseSafeResult.error.flatten().fieldErrors)
    for (const [field, errors] of entries) {
      this.addError(field, errors)
    }
  }
}
