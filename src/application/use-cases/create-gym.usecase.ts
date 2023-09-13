import { Either, EitherType } from '@cahmoraes93/either'
import { Gym } from '../entities/gym.entity'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto, GymDtoFactory } from '../dtos/gym-dto.factory'
import { InternalServerError } from '../errors/internal-server.error'
import { DomainEventPublisher } from '../events/domain-event-publisher'
import { GymCreatedEvent } from '../events/gym-created/gym-created.event'

interface CreateGymUseCaseInput {
  title: string
  latitude: number
  longitude: number
  description?: string | null
  phone?: string | null
}

type CreateGymUseCaseOutput = EitherType<InternalServerError, GymDto>

export class CreateGymUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute(props: CreateGymUseCaseInput): Promise<CreateGymUseCaseOutput> {
    const gym = Gym.create(props)
    const result = await this.performCreateGym(gym)
    this.publishGymCreated(gym)
    return result.isLeft()
      ? Either.left(new InternalServerError())
      : Either.right(GymDtoFactory.create(gym))
  }

  private async performCreateGym(
    aGym: Gym,
  ): Promise<EitherType<Error, boolean>> {
    try {
      await this.gymsRepository.save(aGym)

      return Either.right(true)
    } catch (error) {
      if (error instanceof Error) {
        return Either.left(error)
      }
      throw error
    }
  }

  private publishGymCreated(aGym: Gym) {
    DomainEventPublisher.getInstance().publish(
      new GymCreatedEvent({
        id: aGym.id,
        title: aGym.title,
      }),
    )
  }
}
