import { CheckIn as PrismaCheckIn } from '@prisma/client'
import { CheckIn } from '@/application/entities/check-in.entity'
import { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { prisma } from '../../connection/prisma'
import { DateHelper } from '@/application/entities/services/date-helper'

export class PrismaCheckInsRepository implements CheckInsRepository {
  private readonly prisma = prisma
  private ITEM_PER_PAGE = 20

  async checkInOfId(checkInId: string): Promise<CheckIn | null> {
    const prismaCheckIn = await this.prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    })
    if (!prismaCheckIn) return null
    return this.createCheckInFromPrisma(prismaCheckIn)
  }

  private createCheckInFromPrisma(aCheckInDto: PrismaCheckIn) {
    return CheckIn.create(
      {
        gymId: aCheckInDto.gym_id,
        userId: aCheckInDto.user_id,
        createdAt: aCheckInDto.created_at,
        validatedAt: aCheckInDto.validated_at,
      },
      aCheckInDto.id,
    )
  }

  async save(aCheckIn: CheckIn): Promise<CheckIn> {
    await this.prisma.checkIn.create({
      data: {
        id: aCheckIn.id.toString(),
        created_at: aCheckIn.createAt,
        gym_id: aCheckIn.gymId.toString(),
        user_id: aCheckIn.userId.toString(),
        validated_at: aCheckIn.validatedAt,
      },
    })
    return aCheckIn
  }

  async checkInByUserIdOnDate(
    userId: string,
    aDate: Date,
  ): Promise<CheckIn | null> {
    const dateHelper = new DateHelper()
    const checkIn = await this.prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: dateHelper.startOfTheDay(aDate),
          lte: dateHelper.endOfTheDay(aDate),
        },
      },
    })
    if (!checkIn) return null
    return this.createCheckInFromPrisma(checkIn)
  }

  async checkInsByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const prismaCheckIns = await this.prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      skip: this.ITEM_PER_PAGE,
      take: (page - 1) * this.ITEM_PER_PAGE,
    })
    return prismaCheckIns.map(this.createCheckInFromPrisma)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }
}
