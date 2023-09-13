import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { DomainEvent } from '../domain-event'
import { DomainEvents } from '../domain-events.enum'

export interface GymCreatedProps {
  id: UniqueIdentity
  title: string
}

export class GymCreatedEvent implements DomainEvent {
  public readonly eventType: string
  public readonly data: GymCreatedProps

  constructor(props: GymCreatedProps) {
    this.eventType = DomainEvents.GYM_CREATED
    this.data = props
  }
}
