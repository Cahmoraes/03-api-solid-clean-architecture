import { CreateUserUseCase } from './create-user.usecase'
import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { SuccessResponse } from '@/infra/http/entities/success-response'
import bcrypt from 'bcrypt'
import { User } from '../entities/user.entity'
import { provide } from '@/infra/dependency-inversion/registry'
import { UserAlreadyExistsError } from '../errors/user-already-exists.error'

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
    })
    expect(result.isRight()).toBeTruthy()
    const value = result.value as SuccessResponse<User>
    expect(value.data?.name).toEqual('John Doe')
    expect(value.data?.email).toEqual('jhon@doe.com')
    expect(value.data?.id.toString()).toBeDefined()
    expect(usersRepository.data.toArray()[0]).toEqual(result.value.data)
    const isPasswordCorrectlyHashed = await bcrypt.compare(
      '123456',
      value.data!.passwordHash,
    )
    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not able to create an user with same email', async () => {
    const email = 'jhon@doe.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value.data).toBeInstanceOf(UserAlreadyExistsError)
    expect(result.value.status).toBe(400)
  })
})
