import { env } from '@/env'
import { NextFunction, Request, Response } from 'express'
import tokenService from 'jsonwebtoken'
export async function expressJwtVerifyMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const jwt = request.headers.authorization
  if (!jwt) return next()
  const result = tokenService.verify(jwt.split(' ')[1], env.JWT_SECRET)
  request.user = result
  return next()
}
