import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { User } from '../entities/user.entity'
import { GetUserProfileUseCase } from './get-user-profile.usecase'
import { provide } from '@/infra/dependency-inversion/registry'
import { ResourceNotFoundError } from '../errors/resource-not-found.error'
import { UserDto } from '../dtos/user-dto.factory'
import { Password } from '../entities/value-objects/password'

describe('GetUserProfile use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    provide('usersRepository', usersRepository)
    sut = new GetUserProfileUseCase()
  })

  it('should be able to get user by id', async () => {
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
    })

    expect(result.isRight()).toBe(true)
    const value = result.value as UserDto
    expect(value.email).toBe(email)
    expect(value.name).toBe(name)
  })

  it('should not be able to get user by wrong id', async () => {
    const result = await sut.execute({
      userId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
