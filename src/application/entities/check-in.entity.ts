import { Entity } from '@/core/entities/entity'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { Optional } from '@/core/types/optional'
import { Either, EitherType } from '@cahmoraes93/either'
import { DateHelper } from './services/date-helper'
import { LateCheckInValidateError } from './errors/late-check-in-validate.error'

export interface CheckInProps {
  userId: string
  gymId: string
  createdAt: Date
  validatedAt?: Date | null
}

type CheckInInternalProps = Omit<CheckInProps, 'userId' | 'gymId'> & {
  userId: UniqueIdentity
  gymId: UniqueIdentity
}

export class CheckIn extends Entity<CheckInInternalProps> {
  private TOLERANCE_MINUTES_TO_CHECK_IN = 20

  static create(
    props: Optional<CheckInProps, 'createdAt'>,
    anId?: string | UniqueIdentity,
  ) {
    const { gymId, userId, ...rest } = props
    return new CheckIn(
      {
        createdAt: new Date(),
        ...rest,
        gymId: new UniqueIdentity(gymId),
        userId: new UniqueIdentity(userId),
      },
      anId,
    )
  }

  get userId(): UniqueIdentity {
    return this.props.userId
  }

  get gymId(): UniqueIdentity {
    return this.props.gymId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get validatedAt(): Date | undefined | null {
    return this.props.validatedAt
  }

  public validate(): EitherType<Error, Date> {
    if (this.isValidToCheckIn()) {
      return Either.left(new LateCheckInValidateError())
    }
    const today = new Date()
    this.props.validatedAt = today
    return Either.right(today)
  }

  private isValidToCheckIn(): boolean {
    return (
      this.distanceInMinutesFromCheckingCreation >
      this.TOLERANCE_MINUTES_TO_CHECK_IN
    )
  }

  private get distanceInMinutesFromCheckingCreation() {
    const dateHelper = new DateHelper()
    return dateHelper.distanceInMinutesFromDate(this.createdAt)
  }
}
