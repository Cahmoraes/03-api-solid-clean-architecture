import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@/core/types/optional'

export interface CheckInProps {
  userId: string
  gymId: string
  createdAt: Date
  validatedAt?: Date
}

type CheckInInternalProps = Omit<CheckInProps, 'userId' | 'gymId'> & {
  userId: UniqueIdentity
  gymId: UniqueIdentity
}

export class CheckIn extends Entity<CheckInInternalProps> {
  static create(props: Optional<CheckInProps, 'createdAt'>) {
    const { gymId, userId, ...rest } = props
    return new CheckIn({
      createdAt: new Date(),
      ...rest,
      gymId: new UniqueIdentity(gymId),
      userId: new UniqueIdentity(userId),
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
