import { User } from '../entities/user.entity'

export interface UsersRepository {
  save(anUser: User): Promise<User>
  userOfId(anId: string): Promise<User | null>
  userOfEmail(anEmail: string): Promise<User | null>
}
