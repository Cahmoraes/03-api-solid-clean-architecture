import { PasswordHash } from './password-hash'

describe('PasswordHash test suite', () => {
  let passwordHash: PasswordHash
  beforeEach(() => {
    passwordHash = new PasswordHash()
  })

  it('should create a hash', async () => {
    const password = '123456'
    const passwordHashSpy = vi.spyOn(PasswordHash.prototype, 'createHash')
    expect(passwordHash).toBeInstanceOf(PasswordHash)
    const hash = await passwordHash.createHash(password)
    expect(hash).not.toBe(password)
    expect(hash).toEqual(expect.any(String))
    expect(passwordHashSpy).toHaveBeenCalledTimes(1)
    expect(passwordHashSpy).toHaveBeenCalledWith(password)
  })

  it('should compare password and hash', async () => {
    const password = '123456'
    const hash = await passwordHash.createHash(password)
    const expected = await passwordHash.isMatch(password, hash)
    expect(expected).toBeTruthy()
  })
})
