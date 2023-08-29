import {
  UserCreateInput,
  UsersRepository,
} from '@/application/repositories/users-repository'
import { prisma } from '../connection/prisma'
import { User } from '@/application/entities/user'
import { User as UserPrismaDto } from '@prisma/client'

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

  async create(aUser: UserCreateInput): Promise<User> {
    const userDto = await this.prisma.user.create({
      data: aUser,
    })
    return this.createUserFromDto(userDto)
  }
}
