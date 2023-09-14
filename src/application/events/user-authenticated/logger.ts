export interface Logger {
  save(input: object): Promise<void>
}
