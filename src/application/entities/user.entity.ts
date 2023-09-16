import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@prisma/client/runtime/library'
import { UserValidator } from './validators/user.validator'
import { Either, EitherType } from '@cahmoraes93/either'
import { UserValidatorError } from './errors/user-validator.error'
import { ErrorsMap } from './validators/validator'

export type Role = 'MEMBER' | 'ADMIN'
export interface UserProps {
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  role: Role
}
export type UserCreateProps = Optional<UserProps, 'createdAt' | 'role'>

export class User extends Entity<UserProps> {
  static create(
    props: UserCreateProps,
    anId?: string | UniqueIdentity,
  ): EitherType<UserValidatorError, User> {
    const userOrError = User.validate(props)
    if (userOrError.isLeft()) {
      return Either.left(new UserValidatorError(userOrError.value))
    }
    const user = new User(
      {
        createdAt: new Date(),
        role: 'MEMBER',
        ...props,
      },
      anId,
    )
    return Either.right(user)
  }

  private static validate(
    props: UserCreateProps,
  ): EitherType<ErrorsMap, UserCreateProps> {
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
    return this.props.passwordHash
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get role(): Role {
    return this.props.role
  }
}
