import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { inject, provide } from './registry'

describe('Registry', () => {
  it('should provide a dependency', () => {
    provide('usersRepository', InMemoryUsersRepository)
    expect(inject('usersRepository')).toBe(InMemoryUsersRepository)
  })

  it('should throw error when inject an un registry dependency', () => {
    expect(() => inject('createUserUseCase')).toThrow()
  })
})
