import { DomainEvent } from './domain-event'
import { DomainEventSubscriber } from './domain-event-subscriber'

export class DomainEventPublisher {
  private static instance: DomainEventPublisher
  private readonly subscribers = new Map<string, DomainEventSubscriber[]>()

  protected constructor() {}

  /* c8 ignore start */
  static getInstance(): DomainEventPublisher {
    if (!DomainEventPublisher.instance)
      DomainEventPublisher.instance = new DomainEventPublisher()
    return DomainEventPublisher.instance
  }

  public publish(aDomainEvent: DomainEvent): void {
    const eventType = aDomainEvent.eventType
    const subscribers = this.subscribers.get(eventType)
    if (!subscribers) return
    for (const subscriber of subscribers) {
      subscriber.handleEvent(aDomainEvent)
    }
  }

  public subscribe(aSubscriber: DomainEventSubscriber): void {
    const eventType = aSubscriber.eventType
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, [])
    }
    this.subscribers.get(eventType)!.push(aSubscriber)
  }
}
