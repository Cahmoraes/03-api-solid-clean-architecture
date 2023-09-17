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
  try {
    const result = tokenService.verify(tokenFromJwt(jwt), env.JWT_SECRET)
    assertJwt(result)
    request.user = result
    return next()
  } catch {
    return response.status(401).send({ message: 'Unauthorized' })
  }

  function tokenFromJwt(aJwt: string) {
    return aJwt.split(' ')[1]
  }

  function assertJwt(anObject: any): asserts anObject is Request['user'] {
    if (
      !Reflect.has(anObject, 'role') ||
      !Reflect.has(anObject, 'sub') ||
      !Reflect.has(anObject, 'iat')
    ) {
      throw new Error('Invalid token')
    }
  }
}
