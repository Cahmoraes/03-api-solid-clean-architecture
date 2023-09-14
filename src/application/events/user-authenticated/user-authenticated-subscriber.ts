import { DomainEventSubscriber } from '../domain-event-subscriber'
import { DomainEvents } from '../domain-events.enum'
import { UserAuthenticatedEvent } from './user-authenticated.event'
import { Logger } from './logger'

export class UserAuthenticatedSubscriber implements DomainEventSubscriber {
  public readonly eventType: string

  constructor(private readonly logger: Logger) {
    this.eventType = DomainEvents.USER_AUTHENTICATED
  }

  public handleEvent(aDomainEvent: UserAuthenticatedEvent): void {
    console.log(aDomainEvent.data)
    this.logger.save({
      id: aDomainEvent.data.id.toString(),
      email: aDomainEvent.data.email,
      authenticatedAt: aDomainEvent.data.authenticatedAt,
    })
  }
}
