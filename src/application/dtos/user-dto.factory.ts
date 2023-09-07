import { Role, User } from '../entities/user.entity'

export interface UserDto {
  id: string
  name: string
  email: string
  createdAt: string
  role: Role
}

export class UserDtoFactory {
  public static create(anUser: User): UserDto {
    return {
      id: anUser.id.toString(),
      name: anUser.name,
      email: anUser.email,
      createdAt: anUser.createdAt.toISOString(),
      role: anUser.role,
    }
  }
}
