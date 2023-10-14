import { Gym } from '@/application/entities/gym.entity'
import { Coord } from '@/application/entities/value-objects/coord'
import { GymsRepository } from '@/application/repositories/gyms-repository'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { makePrismaClient } from '@/infra/connection/prisma'
import { inject } from '@/infra/dependency-inversion/registry'
import { PrismaClient, Gym as PrismaGym } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  private readonly prisma: PrismaClient = makePrismaClient()
  private readonly ITEM_PER_PAGE = 20
  private readonly cacheRepository = inject<CacheRepository>('cacheRepository')

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
    this.cacheRepository.delete(`gyms:*:details`)
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
    const coord = Coord.restore({
      latitude: aPrismaGym.latitude.toNumber(),
      longitude: aPrismaGym.longitude.toNumber(),
    })
    return Gym.restore(
      {
        coord,
        title: aPrismaGym.title,
        description: aPrismaGym.description,
        phone: aPrismaGym.phone,
      },
      aPrismaGym.id,
    )
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const cacheHit = await this.cacheRepository.get(
      `gyms:${query}${page}:details`,
    )
    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)
      return cachedData.map(this.createGymFromPrisma)
    }
    const prismaGymsPersisted = await this.prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * this.ITEM_PER_PAGE,
      take: 20,
    })
    prismaGymsPersisted.map(this.createGymFromPrisma)
    await this.cacheRepository.set(
      `gyms:${query}${page}:details`,
      JSON.stringify(prismaGymsPersisted),
    )
    return prismaGymsPersisted.map(this.createGymFromPrisma)
  }

  async findManyNearby(aCoord: Coord): Promise<Gym[]> {
    const prismaGyms = await this.prisma.$queryRaw<PrismaGym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${aCoord.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${aCoord.longitude}) ) + sin( radians(${aCoord.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return prismaGyms.map(this.createGymFromPrisma)
  }
}
