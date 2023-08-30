import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { User } from './user.entity'

describe('User Entity', () => {
  const name = 'John Doe'
  const email = 'jhon@doe.com'
  const passwordHash = '123456'

  it('should create an User without id', () => {
    const user = User.create({
      name,
      email,
      passwordHash,
    })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
    expect(user.passwordHash).toBe(passwordHash)
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.id).toBeInstanceOf(UniqueIdentity)
    expect(user.id.toString()).toEqual(expect.any(String))
  })

  it('should create an User with id', () => {
    const fakeId = 'fake-id'
    const user = User.create(
      {
        name,
        email,
        passwordHash,
      },
      fakeId,
    )

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(name)
    expect(user.email).toBe(email)
    expect(user.passwordHash).toBe(passwordHash)
    expect(user.id).toBeInstanceOf(UniqueIdentity)
    expect(user.id.toString()).toEqual(fakeId)
  })

  it('should create an User in a specific date', () => {
    const createdAt = new Date('2020-01-01')
    const user = User.create({
      name,
      email,
      passwordHash,
      createdAt,
    })
    expect(user.createdAt.getTime()).toBe(createdAt.getTime())
  })
})
