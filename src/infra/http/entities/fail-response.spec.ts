import { test, expect } from 'vitest'
import { FailResponse } from './fail-response'
import { HTTP_STATUS_CODES } from './http-status-code.enum'
import { InvalidAssertError } from '@/errors/invalid-assert-error'

const ErrorMessage = 'Error message'

describe('FailResponse', () => {
  test('FailResponse.bad should create a FailResponse instance with BAD_REQUEST status', () => {
    const response = FailResponse.bad(ErrorMessage)
    expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST)
  })

  test('FailResponse.unauthorized should create a FailResponse instance with UNAUTHORIZED status', () => {
    const response = FailResponse.unauthorized(ErrorMessage)
    expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED)
  })

  test('FailResponse.forbidden should create a FailResponse instance with FORBIDDEN status', () => {
    const response = FailResponse.forbidden(ErrorMessage)
    expect(response.status).toBe(HTTP_STATUS_CODES.FORBIDDEN)
    expect(response.data).toBe(ErrorMessage)
  })

  test('FailResponse.notFound create a FailResponse instance with NOT_FOUND status', () => {
    const response = FailResponse.notFound(ErrorMessage)
    expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND)
    expect(response.data).toBe(ErrorMessage)
  })

  test('FailResponse.internalServerError create a FailResponse instance with INTERNAL_SERVER_ERROR status', () => {
    const response = FailResponse.internalServerError(ErrorMessage)
    expect(response.status).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    expect(response.data).toBe(ErrorMessage)
  })

  test('toDto should return an object with status and data properties', () => {
    const response = FailResponse.bad(ErrorMessage)

    const dto = response.toDto()
    expect(dto).toEqual({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      data: ErrorMessage,
    })
  })

  test('formatError should return an object with status and data properties formatted when data is instance of Error', () => {
    const response = FailResponse.bad(new Error(ErrorMessage))

    const dto = response.formatError()
    expect(dto).toEqual({
      status: HTTP_STATUS_CODES.BAD_REQUEST,
      data: ErrorMessage,
    })
  })

  test('formatError should thrown error when data is not instance of Error', () => {
    const response = FailResponse.bad(ErrorMessage)
    expect(() => response.formatError()).toThrow(InvalidAssertError)
  })
})
