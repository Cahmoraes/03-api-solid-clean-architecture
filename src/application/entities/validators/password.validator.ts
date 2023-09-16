import { Either, EitherType } from '@cahmoraes93/either'
import { Validator } from './validator'
import { z } from 'zod'
import { ValidatorError } from '../errors/validator.error'

const createPasswordSchema = z.object({
  password: z.string().min(6),
})

type CreatePasswordDto = z.infer<typeof createPasswordSchema>

export class PasswordValidator extends Validator<CreatePasswordDto> {
  public validate(): EitherType<ValidatorError, CreatePasswordDto> {
    const result = createPasswordSchema.safeParse(this.props)
    if (!result.success) this.formatErrors(result)
    return this.hasErrors()
      ? Either.left(new ValidatorError(this.stringifyErrors))
      : Either.right(this.props)
  }

  protected formatErrors(parseSafeResult: z.SafeParseError<CreatePasswordDto>) {
    const entries = Object.entries(parseSafeResult.error.flatten().fieldErrors)
    for (const [field, errors] of entries) {
      this.addError(field, errors)
    }
  }
}
