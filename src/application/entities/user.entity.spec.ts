import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'
import { User } from './user.entity'
import { randomUUID } from 'crypto'
import { Password } from './value-objects/password'
import { ValidatorError } from './errors/validator.error'

describe('User Entity', async () => {
  const passwordOrError = await Password.create('123456')
  const password = passwordOrError.value as Password
  const userDS = {
    email: 'jhon@doe.com',
    name: 'John Doe',
    password,
  }

  it('should create an User', () => {
    const result = User.create(userDS)
    const user = result.value as User
    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe(userDS.name)
    expect(user.email).toBe(userDS.email)
    expect(user.passwordHash.toString()).toBe(userDS.password.toString())
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
    expect(user.passwordHash).toBe(userDS.password.toString())
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.id).toBeInstanceOf(UniqueIdentity)
    expect(user.role).toEqual('ADMIN')
  })

  it('should not be able to create an user with invalid props', () => {
    const result = User.create({
      name: '',
      email: '',
      password: userDS.password,
    })
    expect(result.isLeft()).toBeTruthy()
    const error = result.value as ValidatorError
    expect(error).toBeInstanceOf(ValidatorError)
    expect(error.message).toEqual(
      JSON.stringify({
        name: ['String must contain at least 6 character(s)'],
        email: ['Invalid email'],
      }),
    )
  })

  it('should be able to update password', async () => {
    const result = User.create(userDS)
    const user = result.value as User
    const newPasswordOrError = await Password.create('new-password')
    const newPassword = newPasswordOrError.value as Password
    user.updatePassword(newPassword)
    expect(user.passwordHash).toBe(newPassword.toString())
  })
})
