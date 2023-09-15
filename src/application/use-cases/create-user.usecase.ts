import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { Role, User } from '../entities/user.entity'
import { PasswordHash } from '@/core/entities/password-hash'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { DomainEventPublisher } from '../events/domain-event-publisher'
import { UserCreatedEvent } from '../events/user-created/user-created.event'
import { UserDto, UserDtoFactory } from '../dtos/user-dto.factory'
import { UserValidatorError } from '../entities/errors/user-validator.error'

export interface CreateUserUseCaseInput {
  name: string
  email: string
  password: string
  role: Role
}

export type CreateUserUseCaseOutput = EitherType<
  UserAlreadyExistsError | UserValidatorError,
  UserDto
>

export class CreateUserUseCase {
  private readonly usersRepository = inject<UsersRepository>('usersRepository')

  async execute(
    aCreateUserInput: CreateUserUseCaseInput,
  ): Promise<CreateUserUseCaseOutput> {
    const existsUser = await this.existsUser(aCreateUserInput.email)
    if (existsUser) return Either.left(new UserAlreadyExistsError())
    const userOrError = await this.performCreateUser(aCreateUserInput)
    if (userOrError.isLeft()) return Either.left(userOrError.value)
    const user = userOrError.value
    await this.usersRepository.save(user)
    this.publishUserCreated(user)
    return Either.right(UserDtoFactory.create(user))
  }

  private async existsUser(email: string): Promise<boolean> {
    const existsUser = await this.usersRepository.userOfEmail(email)
    return !!existsUser
  }

  private async performCreateUser(
    aCreateUserInput: CreateUserUseCaseInput,
  ): Promise<EitherType<UserValidatorError, User>> {
    const passwordHashed = await this.hashPassword(aCreateUserInput.password)
    return User.create({
      name: aCreateUserInput.name,
      email: aCreateUserInput.email,
      role: aCreateUserInput.role,
      passwordHash: passwordHashed,
    })
  }

  private hashPassword(aPassword: string): Promise<string> {
    const passwordHash = new PasswordHash()
    return passwordHash.createHash(aPassword)
  }

  private publishUserCreated(aUser: User) {
    DomainEventPublisher.getInstance().publish(
      new UserCreatedEvent({
        id: aUser.id,
        email: aUser.email,
      }),
    )
  }
}
