import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../entities/user.entity'
import { PasswordHash } from '@/core/entities/password-hash'
import { inject } from '@/infra/dependency-inversion/registry'

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
    const user = await this.usersRepository.userOfEmail(email)
    if (!user) {
      return Either.left(FailResponse.unauthorized('Invalid credentials'))
    }
    const doesPasswordMatches = await this.comparePasswordAndHash(
      password,
      user.passwordHash,
    )
    if (!doesPasswordMatches) {
      return Either.left(FailResponse.unauthorized('Invalid credentials'))
    }
    return Either.right(SuccessResponse.ok(user))
  }

  private async comparePasswordAndHash(
    aPassword: string,
    aHash: string,
  ): Promise<boolean> {
    const passwordHash = new PasswordHash()
    return passwordHash.isMatch(aPassword, aHash)
  }
}
