import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { DomainEventSubscriber } from './domain-event-subscriber'
import { TestingDomainEventPublisher } from './testing-domain-event-publisher'
import { UserCreatedEvent } from './user-created/user-created.event'

describe('DomainEventPublisher', () => {
  class FakeSubscriber implements DomainEventSubscriber {
    readonly eventType = 'testing-user.created'
    handleEvent(): void {}
  }

  it('should subscribe a subscriber', () => {
    TestingDomainEventPublisher.getInstance().subscribe(new FakeSubscriber())
    expect(TestingDomainEventPublisher.testingSubscribers[0]).toBeInstanceOf(
      FakeSubscriber,
    )
  })

  it('should publish an event', () => {
    const instance = TestingDomainEventPublisher.getInstance()
    instance.subscribe(new FakeSubscriber())

    instance.publish(
      new UserCreatedEvent({
        id: new UniqueIdentity(),
        email: 'john@doe.com.br',
      }),
    )

    expect(TestingDomainEventPublisher.testingEvent).toHaveLength(1)
    expect(TestingDomainEventPublisher.testingEvent[0]).toBeInstanceOf(
      UserCreatedEvent,
    )
  })
})
