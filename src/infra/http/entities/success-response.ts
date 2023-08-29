import { HTTP_STATUS_CODES } from './http-status-code.enum'
import { Response } from './response'

export class SuccessResponse<TData> extends Response<TData> {
  static created<TData>(aData?: TData) {
    return new SuccessResponse<TData>(HTTP_STATUS_CODES.CREATED, aData)
  }

  static ok<TData>(aData: TData) {
    return new SuccessResponse<TData>(HTTP_STATUS_CODES.OK, aData)
  }
}
