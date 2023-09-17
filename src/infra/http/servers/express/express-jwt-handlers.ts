import { env } from '@/env'
import { JwtHandlers, VerifyUser } from '../http-server'
import { Request } from 'express'
import tokenService from 'jsonwebtoken'

export class ExpressJwtHandlers implements JwtHandlers {
  constructor(private request: Request) {}

  async sign(payload: object, options: any): Promise<string> {
    return tokenService.sign(
      {
        ...payload,
        ...options.sign,
      },
      env.JWT_SECRET,
    )
  }

  async verify(): Promise<VerifyUser> {
    const jwt = this.request.headers.authorization ?? ''
    const user = tokenService.verify(this.tokenFromJwt(jwt), env.JWT_SECRET)
    this.assertJwt(user)
    this.request.user = user
    return this.request.user as VerifyUser
  }

  private tokenFromJwt(aJwt: string) {
    return aJwt.split(' ')[1]
  }

  private assertJwt(anObject: any): asserts anObject is Request['user'] {
    if (
      !Reflect.has(anObject, 'role') ||
      !Reflect.has(anObject, 'sub') ||
      !Reflect.has(anObject, 'iat')
    ) {
      throw new Error('Invalid token')
    }
  }
}
