export interface AsyncValueObject {
  equals(other: object): Promise<boolean>
}
