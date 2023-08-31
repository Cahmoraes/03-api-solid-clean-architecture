import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { EitherType } from '@cahmoraes93/either'

interface ValidateCheckInUseCaseInput {}

type ValidateCheckInUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<void>
>

export class ValidateCheckInUseCase {
  async execute() {}
}
