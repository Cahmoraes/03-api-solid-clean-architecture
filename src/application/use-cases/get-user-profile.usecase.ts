import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../entities/user.entity'
import { inject } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface GetUserProfileUseCaseInput {
  userId: string
}

export type GetUserProfileUseCaseOutput = EitherType<
  FailResponse<ResourceNotFoundError>,
  SuccessResponse<User>
>

export class GetUserProfileUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  public async execute({
    userId,
  }: GetUserProfileUseCaseInput): Promise<GetUserProfileUseCaseOutput> {
    const userExists = await this.usersRepository.userOfId(userId)
    if (!userExists) {
      return Either.left(FailResponse.notFound(new ResourceNotFoundError()))
    }
    return Either.right(SuccessResponse.ok(userExists))
  }
}
