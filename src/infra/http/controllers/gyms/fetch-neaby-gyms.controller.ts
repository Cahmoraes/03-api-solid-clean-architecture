import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto } from '@/application/dtos/gym-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { FetchNearbyGymsUseCase } from '@/application/use-cases/fetch-nearby-gym.usecase'
import { Coord } from '@/application/entities/value-objects/coord'

const FetchNearbyGymsBodySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})
type FetchNearbyGymsBodyDto = z.infer<typeof FetchNearbyGymsBodySchema>
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
    params,
  }: FastifyHttpHandlerParams): Promise<FetchNearbyGymsControllerOutput> {
    const userCoord = new Coord(this.parseParamsOrThrow(params))
    const result = await this.fetchNearbyGymsUseCase.execute({ userCoord })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.created(result.value))
  }

  private parseParamsOrThrow(params: unknown): FetchNearbyGymsBodyDto {
    return FetchNearbyGymsBodySchema.parse(params)
  }
}
