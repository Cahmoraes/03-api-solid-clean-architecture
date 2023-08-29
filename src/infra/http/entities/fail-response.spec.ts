import { test, expect } from 'vitest'
import { FailResponse } from './fail-response'
import { HTTP_STATUS_CODES } from './http-status-code.enum'

test('FailResponse.bad should create a FailResponse instance with BAD_REQUEST status', () => {
  const response = FailResponse.bad()
  expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST)
})

test('FailResponse.unauthorized should create a FailResponse instance with UNAUTHORIZED status', () => {
  const response = FailResponse.unauthorized('Error message')
  expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED)
})

test('FailResponse.forbidden should create a FailResponse instance with FORBIDDEN status', () => {
  const response = FailResponse.forbidden('Error message')
  expect(response.status).toBe(HTTP_STATUS_CODES.FORBIDDEN)
})

test('FailResponse.notFound create a FailResponse instance with NOT_FOUND status', () => {
  const response = FailResponse.notFound('Error message')
  expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND)
})

test('FailResponse.internalServerError create a FailResponse instance with INTERNAL_SERVER_ERROR status', () => {
  const response = FailResponse.internalServerError('Error message')
  expect(response.status).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
})

test('toDto should return an object with status and data properties', () => {
  const response = FailResponse.bad('Error message')

  const dto = response.toDto()
  expect(dto).toEqual({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    data: 'Error message',
  })
})
