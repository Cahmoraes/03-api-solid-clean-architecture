export interface TokenGenerator {
  jwtToken(): Promise<string>
  refreshToken(): Promise<string>
}
