import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { CreateGymUseCase } from '@/application/use-cases/create-gym.usecase'
import { GymDto } from '@/application/dtos/gym-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import type { ErrorsMap } from '@/application/entities/validators/validator'

const CreateGymBodySchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})
type CreateGymBodyDto = z.infer<typeof CreateGymBodySchema>
type CreateGymControllerOutput = EitherType<
  FailResponse<Error | ErrorsMap>,
  SuccessResponse<GymDto>
>

export class CreateGymController {
  private readonly createGymUseCase =
    inject<CreateGymUseCase>('createGymUseCase')

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    body,
  }: FastifyHttpHandlerParams): Promise<CreateGymControllerOutput> {
    const gymDto = this.parseBodyOrThrow(body)
    const result = await this.createGymUseCase.execute(gymDto)
    return result.isLeft()
      ? Either.left(FailResponse.bad(result.value))
      : Either.right(SuccessResponse.created(result.value))
  }

  private parseBodyOrThrow(body: unknown): CreateGymBodyDto {
    return CreateGymBodySchema.parse(body)
  }
}
