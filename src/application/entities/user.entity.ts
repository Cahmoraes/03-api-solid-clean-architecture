import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@prisma/client/runtime/library'

export type Role = 'MEMBER' | 'ADMIN'

export interface UserProps {
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  role: Role
}

export class User extends Entity<UserProps> {
  static create(
    props: Optional<UserProps, 'createdAt' | 'role'>,
    anId?: string | UniqueIdentity,
  ) {
    return new User(
      {
        createdAt: new Date(),
        role: 'MEMBER',
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

  get role(): Role {
    return this.props.role
  }
}
