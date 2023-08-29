import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { inject } from '../registry'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../entities/user'
import { PasswordHash } from '@/core/entities/password-hash'

export interface AuthenticateUseCaseInput {
  email: string
  password: string
}

export type AuthenticateUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<User>
>

export class AuthenticateUseCase {
  private usersRepository = inject<UsersRepository>('usersRepository')

  public async execute({
    email,
    password,
  }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
    const userExists = await this.usersRepository.userOfEmail(email)
    if (!userExists) {
      return Either.left(FailResponse.unauthorized('Invalid credentials'))
    }
    const doesPasswordMatches = await this.comparePasswordAndHash(
      password,
      userExists.passwordHash,
    )
    if (!doesPasswordMatches) {
      return Either.left(FailResponse.unauthorized('Invalid credentials'))
    }
    return Either.right(SuccessResponse.ok(userExists))
  }

  private async comparePasswordAndHash(
    aPassword: string,
    aHash: string,
  ): Promise<boolean> {
    const passwordHash = new PasswordHash()
    return passwordHash.isMatch(aPassword, aHash)
  }
}
