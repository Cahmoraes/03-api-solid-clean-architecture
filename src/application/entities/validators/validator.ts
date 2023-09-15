import { EitherType } from '@cahmoraes93/either'

export abstract class Validator<CreateProps> {
  private _errors: string[] = []

  constructor(protected props: CreateProps) {}

  get errors(): string[] {
    return this._errors
  }

  public addError(aMessage: string): void {
    this._errors.push(aMessage)
  }

  public hasErrors(): boolean {
    return this.errors.length > 0
  }

  abstract validate(): EitherType<unknown, CreateProps>
}
