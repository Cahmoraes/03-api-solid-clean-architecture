import { EitherType } from '@cahmoraes93/either'
import { FailResponse } from '../entities/fail-response'
import { SuccessResponse } from '../entities/success-response'

export const enum HTTPMethodTypes {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

type JwtSignIn = (payload: object, options: object) => Promise<string>
type JwtVerify = (options?: object) => Promise<any>

export interface JwtHandlers {
  sign: JwtSignIn
  verify: JwtVerify
}

export type HttpHandler = (
  body: unknown,
  params: unknown,
  jwtHandler: JwtHandlers,
) => Promise<EitherType<FailResponse<unknown>, SuccessResponse<unknown>>>

export interface HttpServer {
  listen(): Promise<void>
  on(method: HTTPMethodTypes, route: string, handler: HttpHandler): void
}
