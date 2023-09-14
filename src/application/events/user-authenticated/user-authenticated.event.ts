import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { DomainEvent } from '../domain-event'
import { DomainEvents } from '../domain-events.enum'

export interface UserAuthenticatedProps {
  id: UniqueIdentity
  email: string
  authenticatedAt: Date
}

export class UserAuthenticatedEvent implements DomainEvent {
  public readonly eventType: string
  public readonly data: UserAuthenticatedProps

  constructor(props: UserAuthenticatedProps) {
    this.eventType = DomainEvents.USER_AUTHENTICATED
    this.data = props
  }
}
