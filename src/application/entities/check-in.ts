import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@/core/types/optional'

export interface CheckInProps {
  userId: UniqueIdentity
  gymId: UniqueIdentity
  createdAt: Date
  validatedAt?: Date
}

export class CheckIn extends Entity<CheckInProps> {
  static create(props: Optional<CheckInProps, 'createdAt'>) {
    return new CheckIn({
      createdAt: new Date(),
      ...props,
    })
  }

  get userId(): UniqueIdentity {
    return this.props.userId
  }

  get gymId(): UniqueIdentity {
    return this.props.gymId
  }

  get createAt(): Date {
    return this.props.createdAt
  }

  get validatedAt(): Date | undefined {
    return this.props.validatedAt
  }
}
