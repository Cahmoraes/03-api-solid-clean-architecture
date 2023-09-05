import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { CreateCheckInUseCase } from '@/application/use-cases/create-check-in.usecase'
import { CheckInDto } from '@/application/dtos/check-in-dto.factory'

const CreateCheckInBodySchema = z.object({
  userId: z.string().uuid(),
  gymId: z.string().uuid(),
  userLatitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  userLongitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})
type CreateCheckInBodyDto = z.infer<typeof CreateCheckInBodySchema>
type CreateCheckInControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<CheckInDto>
>

export class CreateCheckInController {
  private readonly createCheckInUseCase = inject<CreateCheckInUseCase>(
    'createCheckInUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    body,
  }: FastifyHttpHandlerParams): Promise<CreateCheckInControllerOutput> {
    const createCheckInInputDto = this.parseBodyOrThrow(body)
    const result = await this.createCheckInUseCase.execute(
      createCheckInInputDto,
    )
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.created(result.value))
  }

  private parseBodyOrThrow(body: unknown): CreateCheckInBodyDto {
    return CreateCheckInBodySchema.parse(body)
  }
}
