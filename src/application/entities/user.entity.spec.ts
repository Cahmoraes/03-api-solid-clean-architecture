import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { User } from './user.entity'

describe('User Entity', () => {
  const userDS = {
    email: 'jhon@doe.com',
    name: 'John Doe',
    passwordHash: '123456',
  }

  it('should create an User', () => {
    const user = User.create(userDS)
    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(userDS.name)
    expect(user.email).toBe(userDS.email)
    expect(user.passwordHash).toBe(userDS.passwordHash)
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.id).toBeInstanceOf(UniqueIdentity)
    expect(user.id.toString()).toEqual(expect.any(String))
  })

  it('should create an user with specific ID', () => {
    const specificId = 'user-01'
    const user1 = User.create(userDS, specificId)
    expect(user1.id.toString()).toBe(specificId)

    const specificUniqueIdentity = new UniqueIdentity(specificId)
    const user2 = User.create(userDS, specificUniqueIdentity)
    expect(user2.id.equals(specificUniqueIdentity)).toBeTruthy()
  })
})
