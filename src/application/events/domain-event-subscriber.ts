import { DomainEvent } from './domain-event'

export interface DomainEventSubscriber {
  eventType: string
  handleEvent(aDomainEvent: DomainEvent): void
}
