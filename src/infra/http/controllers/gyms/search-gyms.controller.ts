import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto } from '@/application/dtos/gym-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { SearchGymsUseCase } from '@/application/use-cases/search-gyms.usecase'

const SearchGymsBodySchema = z.object({
  query: z.string(),
  page: z.coerce.number().default(1),
})
type SearchGymsBodyDto = z.infer<typeof SearchGymsBodySchema>
type SearchGymsControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<GymDto[]>
>

export class SearchGymController {
  private readonly searchGymsUseCase =
    inject<SearchGymsUseCase>('searchGymsUseCase')

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    params,
  }: FastifyHttpHandlerParams): Promise<SearchGymsControllerOutput> {
    const searchDto = this.parseParamsOrThrow(params)
    const result = await this.searchGymsUseCase.execute(searchDto)
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.created(result.value))
  }

  private parseParamsOrThrow(params: unknown): SearchGymsBodyDto {
    return SearchGymsBodySchema.parse(params)
  }
}
