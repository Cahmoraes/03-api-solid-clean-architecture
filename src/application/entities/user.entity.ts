import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@prisma/client/runtime/library'

export interface UserProps {
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

export class User extends Entity<UserProps> {
  static create(
    props: Optional<UserProps, 'createdAt'>,
    anId?: string | UniqueIdentity,
  ) {
    return new User(
      {
        createdAt: new Date(),
        ...props,
      },
      anId,
    )
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
}
