import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { User } from './user.entity'
import { randomUUID } from 'crypto'

describe('User Entity', () => {
  const userDS = {
    email: 'jhon@doe.com',
    name: 'John Doe',
    passwordHash: '123456',
  }

  it('should create an User', () => {
    const result = User.create(userDS)
    const user = result.value as User
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
    const result = User.create(userDS, specificId)
    const user1 = result.value as User
    expect(user1.id.toString()).toBe(specificId)

    const specificUniqueIdentity = new UniqueIdentity(specificId)
    const result2 = User.create(userDS, specificUniqueIdentity)
    const user2 = result2.value as User
    expect(user2.id.equals(specificUniqueIdentity)).toBeTruthy()
  })

  it('should restore an user', () => {
    const id = randomUUID()
    const user = User.restore(
      {
        ...userDS,
        createdAt: new Date(),
        role: 'ADMIN',
      },
      id,
    )
    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(userDS.name)
    expect(user.email).toBe(userDS.email)
    expect(user.passwordHash).toBe(userDS.passwordHash)
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.id).toBeInstanceOf(UniqueIdentity)
    expect(user.role).toEqual('ADMIN')
  })
})
