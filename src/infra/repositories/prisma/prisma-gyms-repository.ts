import { Gym } from '@/application/entities/gym.entity'
import { Coord } from '@/application/entities/value-objects/coord'
import { GymsRepository } from '@/application/repositories/gyms-repository'
import { prisma } from '@/infra/connection/prisma'
import { Prisma, Gym as PrismaGym } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  private readonly prisma = prisma
  private ITEM_PER_PAGE = 20

  async save(aGym: Gym): Promise<Gym> {
    await this.prisma.gym.create({
      data: {
        latitude: aGym.coord.latitude,
        longitude: aGym.coord.longitude,
        title: aGym.title,
        id: aGym.id.toString(),
        description: aGym.description,
        phone: aGym.phone,
      },
    })
    return aGym
  }

  async deleteById(gymId: string): Promise<void> {
    await this.prisma.gym.delete({
      where: {
        id: gymId,
      },
    })
  }

  async gymOfId(anId: string): Promise<Gym | null> {
    const prismaCheckIn = await this.prisma.gym.findUnique({
      where: {
        id: anId,
      },
    })
    if (!prismaCheckIn) return null
    return this.createGymFromPrisma(prismaCheckIn)
  }

  private createGymFromPrisma(aPrismaGym: PrismaGym): Gym {
    return Gym.create(
      {
        latitude: aPrismaGym.latitude.toNumber(),
        longitude: aPrismaGym.longitude.toNumber(),
        title: aPrismaGym.title,
        description: aPrismaGym.description,
        phone: aPrismaGym.phone,
      },
      aPrismaGym.id,
    )
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const prismaGyms = await this.prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: this.ITEM_PER_PAGE,
      skip: (page - 1) * this.ITEM_PER_PAGE,
    })
    return prismaGyms.map(this.createGymFromPrisma)
  }

  async findManyNearby(aCoord: Coord): Promise<Gym[]> {
    const prismaGyms = await this.prisma.$queryRaw<PrismaGym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${aCoord.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${aCoord.longitude}) ) + sin( radians(${aCoord.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return prismaGyms.map(this.createGymFromPrisma)
  }
}
