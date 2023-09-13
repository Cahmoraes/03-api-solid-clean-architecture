import { DomainEventSubscriber } from '../domain-event-subscriber'
import { DomainEvents } from '../domain-events.enum'
import { GymCreatedEvent } from './gym-created.event'

export class GymCreatedSubscriber implements DomainEventSubscriber {
  public readonly eventType: string

  constructor() {
    this.eventType = DomainEvents.GYM_CREATED
  }

  public handleEvent(aDomainEvent: GymCreatedEvent): void {
    console.log(aDomainEvent.data)
  }
}
