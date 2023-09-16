import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { User } from '../entities/user.entity'
import { AuthenticateUseCase } from './authenticate.usecase'
import { provide } from '@/infra/dependency-inversion/registry'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UserDto } from '../dtos/user-dto.factory'
import { Password } from '../entities/value-objects/password'

describe('CreateUser use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    provide('usersRepository', usersRepository)
    sut = new AuthenticateUseCase()
  })

  it('should be able to authenticate an user', async () => {
    const passwordAsString = '123456'
    const passwordOrError = await Password.create(passwordAsString)
    const password = passwordOrError.value as Password
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const user = User.create({
      name,
      email,
      password,
      role: 'ADMIN',
    })
    await usersRepository.save(user.value as User)

    const result = await sut.execute({
      email,
      password: passwordAsString,
    })

    expect(result.isRight()).toBe(true)
    const value = result.value as UserDto
    expect(value.email).toBe(email)
    expect(value.name).toBe(name)
  })

  it('should not be able to authenticate a non-existing user', async () => {
    const email = 'johm@doe.com'
    const password = '123456'

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBeFalsy()
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an user with wrong password', async () => {
    const passwordAsString = '123456'
    const invalidPasswordOrError = await Password.create('invalid-password')
    const invalidPassword = invalidPasswordOrError.value as Password
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const user = User.create({
      name,
      email,
      password: invalidPassword,
      role: 'ADMIN',
    })

    await usersRepository.save(user.value as User)

    const result = await sut.execute({
      email,
      password: passwordAsString,
    })

    expect(result.isRight()).toBeFalsy()
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
