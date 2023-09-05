import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { UserDto, UserDtoFactory } from '../dtos/user-dto.factory'
import { User } from '../entities/user.entity'

export interface GetUserProfileUseCaseInput {
  userId: string
}

export type GetUserProfileUseCaseOutput = EitherType<
  Error | ResourceNotFoundError,
  UserDto
>

export class GetUserProfileUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  public async execute({
    userId,
  }: GetUserProfileUseCaseInput): Promise<GetUserProfileUseCaseOutput> {
    const result = await this.performGetUserProfile({ userId })
    return result.isLeft()
      ? Either.left(result.value)
      : Either.right(result.value)
  }

  private async performGetUserProfile({
    userId,
  }: GetUserProfileUseCaseInput): Promise<
    EitherType<Error | ResourceNotFoundError, UserDto>
  > {
    try {
      const user = await this.usersRepository.userOfId(userId)
      if (!user) {
        return Either.left(new ResourceNotFoundError())
      }
      return Either.right(UserDtoFactory.create(user))
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }
}
