import { Either, EitherType } from '@cahmoraes93/either'
import { CheckIn } from '../entities/check-in.entity'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'

interface ValidateCheckInUseCaseInput {
  checkInId: string
}

type ValidateCheckInUseCaseOutput = EitherType<ResourceNotFoundError, CheckIn>

export class ValidateCheckInUseCase {
  private checkInsRepository = inject<CheckInsRepository>('checkInsRepository')

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseInput): Promise<ValidateCheckInUseCaseOutput> {
    const checkIn = await this.checkInsRepository.checkInOfId(checkInId)
    if (!checkIn) {
      return Either.left(new ResourceNotFoundError())
    }
    const isValidated = checkIn.validate()
    if (isValidated.isLeft()) {
      return Either.left(isValidated.value)
    }
    await this.checkInsRepository.save(checkIn)
    return Either.right(checkIn)
  }
}
