import { assert } from '@/core/helpers/assert'
import { HTTP_STATUS_CODES } from './http-status-code.enum'
import { Response } from './response'

export class FailResponse<TData> extends Response<TData> {
  static bad<TData>(aData?: TData) {
    return new FailResponse<TData>(HTTP_STATUS_CODES.BAD_REQUEST, aData)
  }

  static unauthorized<TData>(aData: TData) {
    return new FailResponse<TData>(HTTP_STATUS_CODES.UNAUTHORIZED, aData)
  }

  static forbidden<TData>(aData: TData) {
    return new FailResponse<TData>(HTTP_STATUS_CODES.FORBIDDEN, aData)
  }

  static notFound<TData>(aData: TData) {
    return new FailResponse<TData>(HTTP_STATUS_CODES.NOT_FOUND, aData)
  }

  static internalServerError<TData>(aData: TData) {
    return new FailResponse<TData>(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      aData,
    )
  }

  public toDto() {
    return {
      status: this.status,
      data: this.data,
    }
  }

  public formatError() {
    assert(this.data instanceof Error, 'Data must be an Error')
    return {
      status: this.status,
      data: this.data.message,
    }
  }
}
