import { UniqueIdentity } from './unique-identity'

describe('UniqueIdentity', () => {
  it('should create an unique identity', () => {
    const uniqueIdentity = new UniqueIdentity()
    expect(uniqueIdentity).toBeInstanceOf(UniqueIdentity)
    expect(uniqueIdentity.toString()).toEqual(expect.any(String))
  })

  it('should create an unique identity with defined ID', () => {
    const id = 'fake-id'
    const uniqueIdentity = new UniqueIdentity(id)
    expect(uniqueIdentity).toBeInstanceOf(UniqueIdentity)
    expect(uniqueIdentity.toString()).toBe(id)
  })

  it('should return true when equals is called with different UniqueIdentity with same ID', () => {
    const id1 = 'fake-id-1'
    const id2 = 'fake-id-1'
    const uniqueIdentity1 = new UniqueIdentity(id1)
    const uniqueIdentity2 = new UniqueIdentity(id2)
    expect(uniqueIdentity1.equals(uniqueIdentity2)).toBeTruthy()
  })

  it('should return false when equals is called with different UniqueIdentity', () => {
    const id1 = 'fake-id-1'
    const id2 = 'fake-id-2'
    const uniqueIdentity1 = new UniqueIdentity(id1)
    const uniqueIdentity2 = new UniqueIdentity(id2)
    expect(uniqueIdentity1.equals(uniqueIdentity2)).toBeFalsy()
  })

  it('should return false when equals is called with different Object', () => {
    const id1 = 'fake-id-1'
    const uniqueIdentity1 = new UniqueIdentity(id1)
    const differentObject: any = {}
    expect(uniqueIdentity1.equals(differentObject)).toBeFalsy()
  })
})
