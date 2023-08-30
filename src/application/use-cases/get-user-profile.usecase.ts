import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { inject } from '../registry'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../entities/user.entity'

export interface GetUserProfileUseCaseInput {
  userId: string
}

export type GetUserProfileUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<User>
>

export class GetUserProfileUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  public async execute({
    userId,
  }: GetUserProfileUseCaseInput): Promise<GetUserProfileUseCaseOutput> {
    const userExists = await this.usersRepository.userOfId(userId)
    if (!userExists) {
      return Either.left(FailResponse.notFound('Resource not found'))
    }
    return Either.right(SuccessResponse.ok(userExists))
  }
}
