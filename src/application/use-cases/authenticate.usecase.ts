import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserDto, UserDtoFactory } from '../dtos/user-dto.factory'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UserAuthenticatedEvent } from '../events/user-authenticated/user-authenticated.event'
import { DomainEventPublisher } from '../events/domain-event-publisher'
import { User } from '../entities/user.entity'

export interface AuthenticateUseCaseInput {
  email: string
  password: string
}

export type AuthenticateUseCaseOutput = EitherType<
  InvalidCredentialsError,
  UserDto
>

export class AuthenticateUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  public async execute({
    email,
    password,
  }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
    const user = await this.usersRepository.userOfEmail(email)
    if (!user) return Either.left(new InvalidCredentialsError())
    const doesPasswordMatches = await this.comparePasswordAndHash(
      user,
      password,
    )
    if (!doesPasswordMatches) return Either.left(new InvalidCredentialsError())
    this.publishGymCreated(user)
    return Either.right(UserDtoFactory.create(user))
  }

  private async comparePasswordAndHash(
    aUser: User,
    aPassword: string,
  ): Promise<boolean> {
    return aUser.validatePassword(aPassword)
  }

  private publishGymCreated(aUser: User): void {
    DomainEventPublisher.getInstance().publish(
      new UserAuthenticatedEvent({
        id: aUser.id,
        email: aUser.email,
        authenticatedAt: new Date(),
      }),
    )
  }
}
