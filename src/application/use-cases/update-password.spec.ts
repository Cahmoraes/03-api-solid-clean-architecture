import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { User } from '../entities/user.entity'
import { provide } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { UserDto } from '../dtos/user-dto.factory'
import { Password } from '../entities/value-objects/password'
import { UpdatePasswordUseCase } from './update-password.usecase'
import { ValidatorError } from '../entities/errors/validator.error'

describe('UpdatePassword use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: UpdatePasswordUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    provide('usersRepository', usersRepository)
    sut = new UpdatePasswordUseCase()
  })

  it('should be able to update a password', async () => {
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const passwordOrError = await Password.create('123456')
    const password = passwordOrError.value as Password
    const user = User.create({
      name,
      email,
      password,
      role: 'ADMIN',
    })
    const { id } = await usersRepository.save(user.value as User)

    const result = await sut.execute({
      userId: id.toString(),
      password: '1234567',
    })

    expect(result.isRight()).toBe(true)
    const userResult = result.value as UserDto
    const userFromRepository = (await usersRepository.userOfId(
      userResult.id,
    )) as User
    const isTheSamePassword =
      await userFromRepository.validatePassword('1234567')
    expect(isTheSamePassword).toBeTruthy()
  })

  it('should be able to update to invalid password', async () => {
    const name = 'John Doe'
    const email = 'johm@doe.com'
    const passwordOrError = await Password.create('123456')
    const password = passwordOrError.value as Password
    const user = User.create({
      name,
      email,
      password,
      role: 'ADMIN',
    })
    const { id } = await usersRepository.save(user.value as User)

    const result = await sut.execute({
      userId: id.toString(),
      password: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ValidatorError)
  })

  it('should be able to update to invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-user',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
