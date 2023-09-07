import { JwtHandlers } from '@/infra/http/servers/http-server'

export class TokenGenerator {
  constructor(
    private readonly jwtHandler: JwtHandlers,
    private readonly userId: string,
  ) {}

  public async jwtToken(): Promise<string> {
    return this.jwtHandler.sign(
      {},
      {
        sign: {
          sub: this.userId,
        },
      },
    )
  }

  public async refreshToken(): Promise<string> {
    return this.jwtHandler.sign(
      {},
      {
        sign: {
          sub: this.userId,
          expiresIn: '7d',
        },
      },
    )
  }
}
