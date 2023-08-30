import { User } from '../entities/user.entity'

export interface UsersRepository {
  userOfId(anId: string): Promise<User | null>
  userOfEmail(anEmail: string): Promise<User | null>
  create(anUser: User): Promise<User>
}
