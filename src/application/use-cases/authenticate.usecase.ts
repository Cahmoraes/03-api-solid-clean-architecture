import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { PasswordHash } from '@/core/entities/password-hash'
import { inject } from '@/infra/dependency-inversion/registry'
import { UserDto, UserDtoFactory } from '../dtos/user.dto'
import { User } from '../entities/user.entity'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'

export interface AuthenticateUseCaseInput {
  email: string
  password: string
}

export type AuthenticateUseCaseOutput = EitherType<
  FailResponse<InvalidCredentialsError>,
  SuccessResponse<UserDto>
>

export class AuthenticateUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  public async execute({
    email,
    password,
  }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
    const user = await this.usersRepository.userOfEmail(email)
    if (!user) {
      return Either.left(
        FailResponse.unauthorized(new InvalidCredentialsError()),
      )
    }
    const doesPasswordMatches = await this.comparePasswordAndHash(
      password,
      user.passwordHash,
    )
    if (!doesPasswordMatches) {
      return Either.left(
        FailResponse.unauthorized(new InvalidCredentialsError()),
      )
    }
    return Either.right(SuccessResponse.ok(UserDtoFactory.create(user)))
  }

  private async comparePasswordAndHash(
    aPassword: string,
    aHash: string,
  ): Promise<boolean> {
    const passwordHash = new PasswordHash()
    return passwordHash.isMatch(aPassword, aHash)
  }
}
