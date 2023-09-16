import { UsersRepository } from '@/application/repositories/users-repository'
import { User as PrismaUser } from '@prisma/client'
import { User } from '@/application/entities/user.entity'
import { makePrismaClient } from '@/infra/connection/prisma'
import { Password } from '@/application/entities/value-objects/password'

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
        password: Password.restore(aPrismaUser.password_hash),
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

  async save(anUser: User): Promise<User> {
    const userDto = await this.prisma.user.create({
      data: {
        email: anUser.email,
        name: anUser.name,
        password_hash: anUser.passwordHash,
        id: anUser.id.toString(),
        created_at: anUser.createdAt,
        role: anUser.role,
      },
    })
    return this.restoreUserFromPrisma(userDto)
  }

  async update(anUser: User): Promise<User> {
    const userDto = await this.prisma.user.update({
      where: {
        id: anUser.id.toString(),
      },
      data: {
        email: anUser.email,
        name: anUser.name,
        password_hash: anUser.passwordHash,
        created_at: anUser.createdAt,
        role: anUser.role,
      },
    })
    return this.restoreUserFromPrisma(userDto)
  }
}
