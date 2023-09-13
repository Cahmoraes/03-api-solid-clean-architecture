import { DomainEventSubscriber } from '../domain-event-subscriber'
import { DomainEvents } from '../domain-events.enum'
import { UserAuthenticatedEvent } from './user-authenticated.event'

export class UserAuthenticatedSubscriber implements DomainEventSubscriber {
  public readonly eventType: string

  constructor() {
    this.eventType = DomainEvents.USER_AUTHENTICATED
  }

  public handleEvent(aDomainEvent: UserAuthenticatedEvent): void {
    console.log(aDomainEvent.data)
  }
}
