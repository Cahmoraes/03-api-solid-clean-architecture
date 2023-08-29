import { User } from '../entities/user'

export interface UserCreateInput {
  name: string
  email: string
  password_hash: string
}

export interface UsersRepository {
  userOfId(anId: string): Promise<User | null>
  userOfEmail(anEmail: string): Promise<User | null>
  create(aUser: UserCreateInput): Promise<User>
}
