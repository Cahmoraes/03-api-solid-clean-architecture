import { z } from 'zod'
import { Either, EitherType } from '@cahmoraes93/either'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { FailResponse } from '../../entities/fail-response'
import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserDto } from '@/application/dtos/user-dto.factory'
import { FastifyHttpHandlerParams } from '../../servers/fastify/fastify-http-handler-params'

const getUserProfileBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type GeuUserProfileBodyDto = z.infer<typeof getUserProfileBodySchema>
type GetUserProfileControllerOutput = EitherType<
  FailResponse<Error>,
  SuccessResponse<UserDto>
>

export class GetUserProfileController {
  private readonly authenticateUseCase = inject<AuthenticateUseCase>(
    'authenticateUseCase',
  )

  constructor() {
    this.bindMethod()
  }

  private bindMethod() {
    this.handleRequest = this.handleRequest.bind(this)
  }

  public async handleRequest({
    body,
    jwtHandler,
    request,
  }: FastifyHttpHandlerParams): Promise<GetUserProfileControllerOutput> {
    try {
      console.log(request)
      // const user = await jwtHandler.verify()
      // console.log(user.sub)
      const { email, password } = this.parseBodyOrThrow(body)
      return this.authenticateUseCase.execute({ email, password })
    } catch (error: any) {
      return Either.left(FailResponse.internalServerError(error))
    }
  }

  private parseBodyOrThrow(body: unknown): GeuUserProfileBodyDto {
    return getUserProfileBodySchema.parse(body)
  }
}
