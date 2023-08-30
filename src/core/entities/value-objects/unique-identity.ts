import { randomUUID } from 'node:crypto'
import { ValueObject } from './value-object'

export class UniqueIdentity implements ValueObject {
  private readonly _value: string

  constructor(aString?: UniqueIdentity | string) {
    this._value = aString?.toString() ?? randomUUID()
  }

  public toString() {
    return this._value
  }

  public equals(other: UniqueIdentity): boolean {
    if (!(other instanceof UniqueIdentity)) return false
    return this._value === other._value
  }
}
