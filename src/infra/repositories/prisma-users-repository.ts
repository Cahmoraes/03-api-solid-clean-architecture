import { UsersRepository } from '@/application/repositories/users-repository'
import { prisma } from '../connection/prisma'
import { User as UserPrismaDto } from '@prisma/client'
import { User } from '@/application/entities/user.entity'

export class PrismaUsersRepository implements UsersRepository {
  private prisma = prisma

  async userOfId(anId: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: anId,
      },
    })
    if (!existingUser) return null
    return this.createUserFromDto(existingUser)
  }

  private createUserFromDto(anUserDto: UserPrismaDto) {
    return User.create(
      {
        email: anUserDto.email,
        name: anUserDto.name,
        passwordHash: anUserDto.password_hash,
      },
      anUserDto.id,
    )
  }

  async userOfEmail(anEmail: string): Promise<User | null> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: anEmail,
      },
    })
    if (!existingUser) return null
    return this.createUserFromDto(existingUser)
  }

  async save(aUser: User): Promise<User> {
    const userDto = await this.prisma.user.create({
      data: {
        email: aUser.email,
        name: aUser.name,
        password_hash: aUser.passwordHash,
        id: aUser.id.toString(),
        created_at: aUser.createdAt,
      },
    })
    return this.createUserFromDto(userDto)
  }
}
