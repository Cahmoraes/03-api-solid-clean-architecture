import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { CreateCheckInUseCase } from '@/application/use-cases/create-check-in.usecase'
import { CheckInDto } from '@/application/dtos/check-in-dto.factory'

const CreateCheckInParamsSchema = z.object({
  gymId: z.string().uuid(),
})
type CreateCheckInParamsDto = z.infer<typeof CreateCheckInParamsSchema>

const CreateCheckInBodySchema = z.object({
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
    params,
    request,
  }: FastifyHttpHandlerParams): Promise<CreateCheckInControllerOutput> {
    console.log('**********')
    const { userLatitude, userLongitude } = this.parseBodyOrThrow(body)
    const { gymId } = this.parseParamsOrThrow(params)
    const userId = request.user.sub
    const result = await this.createCheckInUseCase.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.created(result.value))
  }

  private parseParamsOrThrow(params: unknown): CreateCheckInParamsDto {
    return CreateCheckInParamsSchema.parse(params)
  }

  private parseBodyOrThrow(body: unknown): CreateCheckInBodyDto {
    return CreateCheckInBodySchema.parse(body)
  }
}
