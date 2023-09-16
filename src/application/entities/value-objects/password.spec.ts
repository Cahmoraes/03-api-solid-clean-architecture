import { PasswordValidatorError } from '../errors/password-validator.error'
import { Password } from './password'

describe('Password', () => {
  it('should be able to create a password', async () => {
    const password = await Password.create('123456')
    expect(password.value).toBeInstanceOf(Password)
  })

  it('should be able to return true when compare password with your hash', async () => {
    const passwordString = '123456'
    const passwordOrError = await Password.create(passwordString)
    const password = passwordOrError.value as Password
    const isTheSame = await password.compare(passwordString)
    expect(isTheSame).toBeTruthy()
  })

  it('should not be able to create an invalid password', async () => {
    const passwordString = '00'
    const passwordOrError = await Password.create(passwordString)
    expect(passwordOrError.isLeft())
    expect(passwordOrError.value).toBeInstanceOf(PasswordValidatorError)
    const passwordValidatorError =
      passwordOrError.value as PasswordValidatorError
    expect(passwordValidatorError.message).toEqual(
      JSON.stringify({
        password: ['String must contain at least 6 character(s)'],
      }),
    )
  })
})
