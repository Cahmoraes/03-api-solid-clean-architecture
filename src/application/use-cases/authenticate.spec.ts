import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import { User } from '../entities/user.entity'
import { AuthenticateUseCase } from './authenticate.usecase'
import { PasswordHash } from '@/core/entities/password-hash'
import { provide } from '@/infra/dependency-inversion/registry'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UserDto } from '../dtos/user.dto'

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
    })
    await usersRepository.save(user)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBe(true)
    const value = result.value as SuccessResponse<UserDto>
    expect(value.data?.email).toBe(email)
    expect(value.data?.name).toBe(name)
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
    expect(result.value.status).toBe(401)
    expect(result.value.data).toBeInstanceOf(InvalidCredentialsError)
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
    })

    await usersRepository.save(user)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBeFalsy()
    expect(result.isLeft()).toBeTruthy()
    expect(result.value.status).toBe(401)
    expect(result.value.data).toBeInstanceOf(InvalidCredentialsError)
  })
})
