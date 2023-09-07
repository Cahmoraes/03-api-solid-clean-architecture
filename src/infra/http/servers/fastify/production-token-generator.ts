import { JwtHandlers } from '@/infra/http/servers/http-server'

export interface ProductionTokenGeneratorProps {
  jwtHandler: JwtHandlers
  userId: string
  userRole?: string
}

export class ProductionTokenGenerator {
  constructor(private props: ProductionTokenGeneratorProps) {}

  public async jwtToken(): Promise<string> {
    return this.props.jwtHandler.sign(
      {
        role: this.props.userRole,
      },
      {
        sign: {
          sub: this.props.userId,
        },
      },
    )
  }

  public async refreshToken(): Promise<string> {
    return this.props.jwtHandler.sign(
      {
        role: this.props.userRole,
      },
      {
        sign: {
          sub: this.props.userId,
          expiresIn: '7d',
        },
      },
    )
  }
}
