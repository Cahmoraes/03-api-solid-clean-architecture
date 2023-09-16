import { Either, EitherType } from '@cahmoraes93/either'
import { Validator } from './validator'
import { z } from 'zod'
import { ValidatorError } from '../errors/validator.error'

const createCoordSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

type CreateCoordDto = z.infer<typeof createCoordSchema>

export class CoordValidator extends Validator<CreateCoordDto> {
  public validate(): EitherType<ValidatorError, CreateCoordDto> {
    const result = createCoordSchema.safeParse(this.props)
    if (!result.success) this.formatErrors(result)
    return this.hasErrors()
      ? Either.left(new ValidatorError(this.stringifyErrors))
      : Either.right(this.props)
  }

  protected formatErrors(parseSafeResult: z.SafeParseError<CreateCoordDto>) {
    const entries = Object.entries(parseSafeResult.error.flatten().fieldErrors)
    for (const [field, errors] of entries) {
      this.addError(field, errors)
    }
  }
}
