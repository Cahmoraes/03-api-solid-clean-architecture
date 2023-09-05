import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto } from '@/application/dtos/gym-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'
import { SearchGymsUseCase } from '@/application/use-cases/search-gyms.usecase'

const SearchGymsQuerySchema = z.object({
  q: z.string(),
  page: z.coerce.number().default(1),
})
type SearchGymsQueryDto = z.infer<typeof SearchGymsQuerySchema>
type SearchGymsControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<GymDto[]>
>

export class SearchGymsController {
  private readonly searchGymsUseCase =
    inject<SearchGymsUseCase>('searchGymsUseCase')

  constructor() {
    this.bindMethod()
  }

  private bindMethod(): void {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    query,
  }: FastifyHttpHandlerParams): Promise<SearchGymsControllerOutput> {
    const searchDto = this.parseQueryOrThrow(query)
    const result = await this.searchGymsUseCase.execute({
      page: searchDto.page,
      query: searchDto.q,
    })
    return result.isLeft()
      ? Either.left(FailResponse.internalServerError(result.value))
      : Either.right(SuccessResponse.ok(result.value))
  }

  private parseQueryOrThrow(params: unknown): SearchGymsQueryDto {
    return SearchGymsQuerySchema.parse(params)
  }
}
