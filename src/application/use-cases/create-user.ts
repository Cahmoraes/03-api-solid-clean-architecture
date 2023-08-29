import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../entities/user'
import { PasswordHash } from '@/core/entities/password-hash'
import { DependencyTypes, inject } from '../registry'

export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export type CreateUserOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<User>
>

export class CreateUser {
  private readonly usersRepository = inject<UsersRepository>('usersRepository')

  async execute(aCreateUserInput: CreateUserInput): Promise<CreateUserOutput> {
    const existsUser = await this.existsUser(aCreateUserInput.email)
    if (existsUser) return Either.left(FailResponse.bad('User already exists'))
    const user = await this.performCreateUser(aCreateUserInput)
    return Either.right(SuccessResponse.created(user))
  }

  private async existsUser(email: string): Promise<boolean> {
    const existsUser = await this.usersRepository.userOfEmail(email)
    return !!existsUser
  }

  private async performCreateUser(
    aCreateUserInput: CreateUserInput,
  ): Promise<User> {
    const passwordHashed = await this.hashPassword(aCreateUserInput.password)
    return this.usersRepository.create({
      name: aCreateUserInput.name,
      email: aCreateUserInput.email,
      password_hash: passwordHashed,
    })
  }

  private hashPassword(aPassword: string): Promise<string> {
    const passwordHash = new PasswordHash()
    return passwordHash.createHash(aPassword)
  }
}
