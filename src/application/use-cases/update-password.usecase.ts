import { Either, EitherType } from '@cahmoraes93/either'
import { UserDto, UserDtoFactory } from '../dtos/user-dto.factory'
import { UsersRepository } from '../repositories/users-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { Password } from '../entities/value-objects/password'
import { PasswordValidatorError } from '../entities/errors/password-validator.error'

interface UpdatePasswordUseCaseInput {
  userId: string
  password: string
}

type UpdatePasswordUseCaseOutput = EitherType<
  ResourceNotFoundError | PasswordValidatorError,
  UserDto
>

export class UpdatePasswordUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  async execute({
    userId,
    password,
  }: UpdatePasswordUseCaseInput): Promise<UpdatePasswordUseCaseOutput> {
    const user = await this.usersRepository.userOfId(userId)
    if (!user) return Either.left(new ResourceNotFoundError())
    const passwordOrError = await this.createPassword(password)
    if (passwordOrError.isLeft()) return Either.left(passwordOrError.value)
    user.updatePassword(passwordOrError.value)
    await this.usersRepository.update(user)
    return Either.right(UserDtoFactory.create(user))
  }

  private async createPassword(
    aPassword: string,
  ): Promise<EitherType<PasswordValidatorError, Password>> {
    return Password.create(aPassword)
  }
}
