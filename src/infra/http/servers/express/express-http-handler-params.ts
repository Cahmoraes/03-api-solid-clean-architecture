import { HttpHandlerParams, JwtHandlers } from '../http-server'
import { Request, Response } from 'express'

export class ExpressHttpHandlerParams
  implements HttpHandlerParams<Request, Response>
{
  constructor(
    readonly request: Request,
    readonly reply: Response,
  ) {}

  get body(): unknown {
    return this.request.body
  }

  get params(): unknown {
    return this.request.params
  }

  get query(): unknown {
    return this.request.query
  }

  get jwtHandler(): JwtHandlers {
    return {
      async sign(payload, options) {
        return ''
      },
      async verify(options) {
        return {
          iat: 123,
          role: '0',
          sub: '123',
        }
      },
    }
  }
}
