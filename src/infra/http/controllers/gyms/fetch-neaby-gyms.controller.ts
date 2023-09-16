import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto } from '@/application/dtos/gym-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { FetchNearbyGymsUseCase } from '@/application/use-cases/fetch-nearby-gym.usecase'
import { Coord } from '@/application/entities/value-objects/coord'
import { ErrorsMap } from '@/application/entities/validators/validator'

const FetchNearbyGymsQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})
type FetchNearbyGymsQueryDto = z.infer<typeof FetchNearbyGymsQuerySchema>
type FetchNearbyGymsControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<GymDto[]>
>

export class FetchNearbyGymsController {
  private readonly fetchNearbyGymsUseCase = inject<FetchNearbyGymsUseCase>(
    'fetchNearbyGymsUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    query,
  }: FastifyHttpHandlerParams): Promise<FetchNearbyGymsControllerOutput> {
    const userCoordOrError = Coord.create(this.parseQueryOrThrow(query))
    if (userCoordOrError.isLeft()) {
      return Either.left(
        FailResponse.bad(new Error(userCoordOrError.value.toString())),
      )
    }
    const result = await this.fetchNearbyGymsUseCase.execute({
      userCoord: userCoordOrError.value,
    })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.ok(result.value))
  }

  private parseQueryOrThrow(query: unknown): FetchNearbyGymsQueryDto {
    return FetchNearbyGymsQuerySchema.parse(query)
  }
}
