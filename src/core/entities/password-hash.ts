import * as bcrypt from 'bcrypt'

export class PasswordHash {
  private bcrypt = bcrypt

  public async createHash(password: string): Promise<string> {
    return this.bcrypt.hash(password, await this.generateSalt())
  }

  private generateSalt(): Promise<string> {
    return this.bcrypt.genSalt()
  }

  public isMatch(aPassword: string, aHash: string): Promise<boolean> {
    return this.bcrypt.compare(aPassword, aHash)
  }
}
