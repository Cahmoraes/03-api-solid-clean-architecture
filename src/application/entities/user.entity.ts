import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@prisma/client/runtime/library'
import { UserValidator } from './validators/user.validator'
import { Either, EitherType } from '@cahmoraes93/either'
import { Password } from './value-objects/password'
import type { ValidatorError } from './errors/validator.error'

export type Role = 'MEMBER' | 'ADMIN'
export interface UserProps {
  name: string
  email: string
  password: Password
  createdAt: Date
  role: Role
}
export type UserCreateProps = Optional<UserProps, 'createdAt' | 'role'>

export class User extends Entity<UserProps> {
  static create(
    props: UserCreateProps,
    anId?: string | UniqueIdentity,
  ): EitherType<ValidatorError, User> {
    const userOrError = User.validate(props)
    if (userOrError.isLeft()) {
      return Either.left(userOrError.value)
    }
    const user = new User(
      {
        createdAt: new Date(),
        role: 'MEMBER',
        ...props,
        password: Password.restore(props.password.toString()),
      },
      anId,
    )
    return Either.right(user)
  }

  private static validate(
    props: UserCreateProps,
  ): EitherType<ValidatorError, UserCreateProps> {
    const userValidator = new UserValidator(props)
    return userValidator.validate()
  }

  static restore(props: UserProps, anId: string): User {
    return new User(props, anId)
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get passwordHash(): string {
    return this.props.password.toString()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get role(): Role {
    return this.props.role
  }

  async validatePassword(password: string): Promise<boolean> {
    return this.props.password.compare(password)
  }

  public updatePassword(aPassword: Password): void {
    this.props.password = aPassword
  }
}
