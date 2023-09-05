import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { HttpHandlerParams } from '../../servers/http-server'
import { UserDto } from '@/application/dtos/user-dto.factory'
import { Gym } from '@/application/entities/gym.entity'
import { CreateGymUseCase } from '@/application/use-cases/create-gym.usecase'
import { GymDto } from '@/application/dtos/gym-dto.factory'

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
  FailResponse<unknown>,
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
  }: HttpHandlerParams): Promise<CreateGymControllerOutput> {
    try {
      const gymDto = this.parseBodyOrThrow(body)
      return this.createGymUseCase.execute(gymDto)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(FailResponse.internalServerError(error))
      }
      throw error
    }
  }

  private parseBodyOrThrow(body: unknown): CreateGymBodyDto {
    return CreateGymBodySchema.parse(body)
  }
}
