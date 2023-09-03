import { InvalidAssertError } from '@/errors/invalid-assert-error'
import { assert } from './assert'

describe('Assert', () => {
  it('should thrown error when asserts not pass', () => {
    const number = 5
    expect(() => assert(typeof number === 'boolean')).toThrow(
      InvalidAssertError,
    )
  })
})
