import { InternalServerError } from './internal-server.error'

describe('Internal Server Error', () => {
  it('´should create a Internal Server Error instance', () => {
    const error = new InternalServerError()
    expect(error).toBeInstanceOf(InternalServerError)
    expect(error.message).toBe('Internal Server Error')
  })
})
