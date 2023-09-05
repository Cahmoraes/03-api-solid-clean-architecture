import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { CheckInDto } from '@/application/dtos/check-in-dto.factory'
import { ValidateCheckInUseCase } from '@/application/use-cases/validate-check-in.usecase'

const ValidateCheckInParamsSchema = z.object({
  checkInId: z.string().uuid(),
})
type ValidateCheckInParamsDto = z.infer<typeof ValidateCheckInParamsSchema>
type ValidateCheckInControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<CheckInDto>
>

export class ValidateCheckInController {
  private readonly validateCheckInUseCase = inject<ValidateCheckInUseCase>(
    'validateCheckInUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    params,
  }: FastifyHttpHandlerParams): Promise<ValidateCheckInControllerOutput> {
    const { checkInId } = this.parseParamsOrThrow(params)
    const result = await this.validateCheckInUseCase.execute({
      checkInId,
    })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.ok(result.value))
  }

  private parseParamsOrThrow(params: unknown): ValidateCheckInParamsDto {
    return ValidateCheckInParamsSchema.parse(params)
  }
}
