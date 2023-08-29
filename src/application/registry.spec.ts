import { InMemoryUsersRepository } from 'tests/repositories/in-memory-users-repository'
import {
  injectTesting,
  provideTesting,
  clearDependenciesTesting,
} from './registry'

describe('Registry', () => {
  beforeEach(() => {
    clearDependenciesTesting()
  })
  it('should provide a dependency', () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    provideTesting('usersRepository', inMemoryRepository)
    expect(injectTesting('usersRepository')).toBe(inMemoryRepository)
  })

  it('should throw error when inject an un registry dependency', () => {
    expect(() => injectTesting('usersRepository')).toThrow(
      `Dependency usersRepository not found`,
    )
  })
})
