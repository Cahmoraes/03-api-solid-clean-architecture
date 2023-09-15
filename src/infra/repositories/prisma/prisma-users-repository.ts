import { UsersRepository } from '@/application/repositories/users-repository'
import { User as PrismaUser } from '@prisma/client'
import { User } from '@/application/entities/user.entity'
import { makePrismaClient } from '@/infra/connection/prisma'

export class PrismaUsersRepository implements UsersRepository {
  private readonly prisma = makePrismaClient()

  async userOfId(anId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        id: anId,
      },
    })
    if (!prismaUser) return null
    return this.restoreUserFromPrisma(prismaUser)
  }

  private restoreUserFromPrisma(aPrismaUser: PrismaUser) {
    return User.restore(
      {
        email: aPrismaUser.email,
        name: aPrismaUser.name,
        passwordHash: aPrismaUser.password_hash,
        role: aPrismaUser.role,
        createdAt: aPrismaUser.created_at,
      },
      aPrismaUser.id,
    )
  }

  async userOfEmail(anEmail: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: anEmail,
      },
    })
    if (!existingUser) return null
    return this.restoreUserFromPrisma(existingUser)
  }

  async save(aUser: User): Promise<User> {
    const userDto = await this.prisma.user.create({
      data: {
        email: aUser.email,
        name: aUser.name,
        password_hash: aUser.passwordHash,
        id: aUser.id.toString(),
        created_at: aUser.createdAt,
        role: aUser.role,
      },
    })
    return this.restoreUserFromPrisma(userDto)
  }
}
