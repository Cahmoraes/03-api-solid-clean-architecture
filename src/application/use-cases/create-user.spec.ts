import { CreateUserUseCase } from './create-user.usecase'
import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { provide } from '@/infra/dependency-inversion/registry'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'
import { UserDto } from '../dtos/user-dto.factory'
import { UniqueIdentity } from '@/core/entities/value-objects/unique-identity'

describe('CreateUser use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: CreateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    provide('usersRepository', usersRepository)
    sut = new CreateUserUseCase()
  })

  it('should create an user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'jhon@doe.com',
      password: '123456',
      role: 'ADMIN',
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as UserDto
    expect(value.name).toEqual('John Doe')
    expect(value.email).toEqual('jhon@doe.com')
    expect(value.id.toString()).toBeDefined()
    expect(usersRepository.data.toArray()[0]).toMatchObject({
      _id: new UniqueIdentity(value.id.toString()),
      email: value.email,
      name: value.name,
      createdAt: new Date(value.createdAt),
    })
  })

  it('should not able to create an user with same email', async () => {
    const email = 'jhon@doe.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
      role: 'ADMIN',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
      role: 'ADMIN',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
