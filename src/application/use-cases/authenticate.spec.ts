import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { User } from '../entities/user.entity'
import { AuthenticateUseCase } from './authenticate.usecase'
import { PasswordHash } from '@/core/entities/password-hash'
import { provide } from '@/infra/dependency-inversion/registry'
import { InvalidCredentialsError } from '../errors/invalid-credentials.error'
import { UserDto } from '../dtos/user-dto.factory'

describe('CreateUser use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    provide('usersRepository', usersRepository)
    sut = new AuthenticateUseCase()
  })

  it('should be able to authenticate an user', async () => {
    const passwordHash = new PasswordHash()
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const password = '123456'
    const user = User.create({
      name,
      email,
      passwordHash: await passwordHash.createHash(password),
      role: 'ADMIN',
    })
    await usersRepository.save(user.value as User)

    const result = await sut.execute({
      email,
      password,
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
    const passwordHash = new PasswordHash()
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const password = '123456'
    const user = User.create({
      name,
      email,
      passwordHash: await passwordHash.createHash('invalid-password'),
      role: 'ADMIN',
    })

    await usersRepository.save(user.value as User)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBeFalsy()
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
