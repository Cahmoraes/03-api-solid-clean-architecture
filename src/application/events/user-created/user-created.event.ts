import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { DomainEvent } from '../domain-event'
import { DomainEvents } from '../domain-events.enum'

export interface UserCreatedProps {
  id: UniqueIdentity
  email: string
}

export class UserCreatedEvent implements DomainEvent {
  public readonly eventType: string
  public readonly data: UserCreatedProps

  constructor(props: UserCreatedProps) {
    this.eventType = DomainEvents.USER_CREATED
    this.data = props
  }
}
