class Left<TLeft, TRight> {
  constructor(private readonly _value: TLeft) {}

  public isLeft(): this is Left<TLeft, TRight> {
    return true
  }

  public isRight(): this is Right<TLeft, TRight> {
    return false
  }

  get value(): TLeft {
    return this._value
  }
}

class Right<TLeft, TRight> {
  constructor(private readonly _value: TRight) {}

  public isRight(): this is Right<TLeft, TRight> {
    return true
  }

  public isLeft(): this is Left<TLeft, TRight> {
    return false
  }

  get value(): TRight {
    return this._value
  }
}

export type Either<TLeft, TRight> = Left<TLeft, TRight> | Right<TLeft, TRight>

export const right = <TLeft, TRight>(value: TRight) =>
  new Right<TLeft, TRight>(value)

export const left = <TLeft, TRight>(value: TLeft) =>
  new Left<TLeft, TRight>(value)
