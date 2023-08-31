export interface VerifyUser {
  sub: string
  iat: number
}

type JwtSignIn = (payload: object, options: object) => Promise<string>
type JwtVerify = (options?: object) => Promise<VerifyUser>

export interface TokenService {
  sign: JwtSignIn
  verify: JwtVerify
}
