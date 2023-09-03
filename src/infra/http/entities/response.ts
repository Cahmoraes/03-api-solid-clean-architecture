export abstract class Response<TData> {
  protected constructor(
    private readonly _status: number,
    private readonly _data: TData,
  ) {}

  get status(): number {
    return this._status
  }

  get data(): TData {
    return this._data
  }
}
