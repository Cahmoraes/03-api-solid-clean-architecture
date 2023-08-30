import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import { inject, provide, clearDependenciesTesting } from './registry'

describe('Registry', () => {
  beforeEach(() => {
    clearDependenciesTesting?.()
  })
  it('should provide a dependency', () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    provide('usersRepository', inMemoryRepository)
    expect(inject('usersRepository')).toBe(inMemoryRepository)
  })

  it('should throw error when inject an un registry dependency', () => {
    expect(() => inject('usersRepository')).toThrow(
      `Dependency usersRepository not found`,
    )
  })
})
