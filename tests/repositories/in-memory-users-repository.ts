import {
  UserCreateInput,
  UsersRepository,
} from '@/application/repositories/users-repository'
import { User } from '@/application/entities/user'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryUsersRepository implements UsersRepository {
  public data: ExtendedSet<User> = new ExtendedSet()

  async userOfId(anId: string): Promise<User | null> {
    return this.data.find((user) => user.id.toString() === anId) ?? null
  }

  async userOfEmail(anEmail: string): Promise<User | null> {
    return this.data.find((user) => user.email === anEmail) ?? null
  }

  async create(aUser: UserCreateInput): Promise<User> {
    const newUser = User.create({
      email: aUser.email,
      name: aUser.name,
      passwordHash: aUser.password_hash,
    })
    this.data.add(newUser)
    return newUser
  }
}
