import { DomainEvent } from './domain-event'
import { DomainEventPublisher } from './domain-event-publisher'
import { DomainEventSubscriber } from './domain-event-subscriber'

export class TestingDomainEventPublisher extends DomainEventPublisher {
  public static testingSubscribers: DomainEventSubscriber[] = []
  public static testingEvent: DomainEvent[] = []

  public static getInstance(): TestingDomainEventPublisher {
    return new TestingDomainEventPublisher()
  }

  public subscribe(aSubscriber: DomainEventSubscriber): void {
    TestingDomainEventPublisher.testingSubscribers.push(aSubscriber)
    super.subscribe(aSubscriber)
  }

  public publish(aDomainEvent: DomainEvent): void {
    TestingDomainEventPublisher.testingEvent.push(aDomainEvent)
    return super.publish(aDomainEvent)
  }
}
