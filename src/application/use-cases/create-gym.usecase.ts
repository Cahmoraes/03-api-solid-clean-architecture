import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { Gym } from '../entities/gym.entity'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { GymDto, GymDtoFactory } from '../dtos/gym-dto.factory'
import { InternalServerError } from '../errors/internal-server.error'

interface CreateGymUseCaseInput {
  title: string
  latitude: number
  longitude: number
  description?: string | null
  phone?: string | null
}

type CreateGymUseCaseOutput = EitherType<
  FailResponse<InternalServerError>,
  SuccessResponse<GymDto>
>

export class CreateGymUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute(props: CreateGymUseCaseInput): Promise<CreateGymUseCaseOutput> {
    const gym = Gym.create(props)
    const result = await this.performCreateGym(gym)
    if (result.isLeft()) {
      return Either.left(FailResponse.bad(new InternalServerError()))
    }
    return Either.right(SuccessResponse.created(GymDtoFactory.create(gym)))
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
}
