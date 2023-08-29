import { provide } from '../registry'
import { CreateUser } from './create-user'
import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'

describe('CreateUser use case', () => {
  it('should pass', async () => {
    const usersRepository = new InMemoryUsersRepository()
    provide('usersRepository', usersRepository)
    const useCase = new CreateUser()
    const result = await useCase.execute({
      name: 'caique',
      email: 'caique.moraes@teste.com',
      password: '123456',
    })
    expect(result.isRight()).toBeTruthy()
    expect(usersRepository.data.toArray()[0]).toEqual(result.value.data)
  })
})
