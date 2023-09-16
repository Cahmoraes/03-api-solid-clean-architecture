import { EitherType } from '@cahmoraes93/either'

export type ErrorsMap = Map<string, string[]>

export abstract class Validator<CreateProps> {
  private _errors: ErrorsMap = new Map()

  constructor(protected props: CreateProps) {}

  get errors(): ErrorsMap {
    return this._errors
  }

  public addError(fieldError: string, messages: string[]): void {
    this._errors.set(fieldError, messages)
  }

  public hasErrors(): boolean {
    return this.errors.size > 0
  }

  abstract validate(): EitherType<unknown, CreateProps>
}
