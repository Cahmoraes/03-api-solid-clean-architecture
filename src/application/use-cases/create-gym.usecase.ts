import { FailResponse } from '@/infra/http/entities/fail-response'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { Either, EitherType } from '@cahmoraes93/either'
import { Gym } from '../entities/gym.entity'
import { GymsRepository } from '../repositories/gyms-repository'
import { inject } from '@/infra/dependency-inversion/registry'

interface CreateGymUseCaseInput {
  title: string
  latitude: number
  longitude: number
  description?: string | null
  phone?: string
}

type CreateGymUseCaseOutput = EitherType<
  FailResponse<unknown>,
  SuccessResponse<Gym>
>

export class CreateGymUseCase {
  private gymsRepository = inject<GymsRepository>('gymsRepository')

  async execute(props: CreateGymUseCaseInput): Promise<CreateGymUseCaseOutput> {
    const gym = Gym.create(props)
    await this.gymsRepository.save(gym)
    return Either.right(SuccessResponse.ok(gym))
  }
}
