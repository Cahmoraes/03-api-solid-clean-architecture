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

export interface VerifyUser {
  sub: string
  iat: number
}

type JwtSignIn = (payload: object, options: object) => Promise<string>
type JwtVerify = (options?: object) => Promise<VerifyUser>

export interface JwtHandlers {
  sign: JwtSignIn
  verify: JwtVerify
}

export interface HttpHandlerParams<TRequest = any, TResponse = any> {
  body: unknown
  params: unknown
  query: unknown
  jwtHandler: JwtHandlers
  request: TRequest
  reply: TResponse
}

export type HttpHandler = (
  httpHandlerParams: HttpHandlerParams,
) => Promise<EitherType<FailResponse<Error>, SuccessResponse<unknown>>>

type Middleware = (...args: any[]) => void

export interface MiddlewareProps {
  onRequest: Middleware | Middleware[]
}

export interface HttpServer {
  listen(): Promise<void>
  on(
    method: HTTPMethodTypes,
    route: string,
    handler: HttpHandler,
    middleware?: MiddlewareProps,
  ): void
}
