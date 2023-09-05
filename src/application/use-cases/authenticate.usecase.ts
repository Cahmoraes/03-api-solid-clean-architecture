import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { PasswordHash } from '@/core/entities/password-hash'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserDto, UserDtoFactory } from '../dtos/user-dto.factory'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'

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
    if (!user) {
      return Either.left(new InvalidCredentialsError())
    }
    const doesPasswordMatches = await this.comparePasswordAndHash(
      password,
      user.passwordHash,
    )
    if (!doesPasswordMatches) {
      return Either.left(new InvalidCredentialsError())
    }
    return Either.right(UserDtoFactory.create(user))
  }

  private async comparePasswordAndHash(
    aPassword: string,
    aHash: string,
  ): Promise<boolean> {
    const passwordHash = new PasswordHash()
    return passwordHash.isMatch(aPassword, aHash)
  }
}
