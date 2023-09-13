import { DomainEventSubscriber } from '../domain-event-subscriber'
import { DomainEvents } from '../domain-events.enum'
import { UserCreatedEvent } from './user-created.event'

export class UserCreatedSubscriber implements DomainEventSubscriber {
  public readonly eventType: string

  constructor() {
    this.eventType = DomainEvents.USER_CREATED
  }

  public handleEvent(aDomainEvent: UserCreatedEvent): void {
    console.log(aDomainEvent.data)
  }
}
