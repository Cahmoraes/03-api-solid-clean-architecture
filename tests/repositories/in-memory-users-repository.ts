import { User } from '@/application/entities/user.entity'
import { UsersRepository } from '@/application/repositories/users-repository'
import ExtendedSet from '@cahmoraes93/extended-set'

export class InMemoryUsersRepository implements UsersRepository {
  public data: ExtendedSet<User> = new ExtendedSet()

  async userOfId(anId: string): Promise<User | null> {
    return this.data.find((user) => user.id.toString() === anId) ?? null
  }

  async userOfEmail(anEmail: string): Promise<User | null> {
    return this.data.find((user) => user.email === anEmail) ?? null
  }

  async save(aUser: User): Promise<User> {
    this.data.add(aUser)
    return aUser
  }
}
