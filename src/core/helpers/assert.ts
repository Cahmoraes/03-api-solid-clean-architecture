import { InvalidAssertError } from '@/errors/invalid-assert.error'

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (condition === false) throw new InvalidAssertError(message)
}
