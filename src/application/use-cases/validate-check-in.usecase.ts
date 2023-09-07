import { Either, EitherType } from '@cahmoraes93/either'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { inject } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { CheckInDto, CheckInDtoFactory } from '../dtos/check-in-dto.factory'

interface ValidateCheckInUseCaseInput {
  checkInId: string
}

type ValidateCheckInUseCaseOutput = EitherType<
  ResourceNotFoundError,
  CheckInDto
>

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
    await this.checkInsRepository.update(checkIn)
    return Either.right(CheckInDtoFactory.create(checkIn))
  }
}
