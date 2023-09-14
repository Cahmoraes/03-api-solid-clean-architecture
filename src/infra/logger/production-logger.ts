import { Logger } from '@/application/events/user-authenticated/logger'
import {
  ReadStream,
  WriteStream,
  createReadStream,
  createWriteStream,
} from 'fs'
import { access, constants, writeFile } from 'fs/promises'
import { join } from 'path'

export class ProductionLogger implements Logger {
  private readonly FILE_NAME = 'sessions.json'
  private readonly FILE_PATH = join(process.cwd(), 'log', this.FILE_NAME)

  async save(input: object): Promise<void> {
    this.writeFile(input)
  }

  private async writeFile(input: object): Promise<void> {
    try {
      await this.createFileIfNotExists()
      const readStream = this.createReadStream()
      await this.saveContent(readStream, input)
    } catch (readError) {
      console.error('Erro ao ler o arquivo:', readError)
    }
  }

  private async createFileIfNotExists() {
    try {
      await access(this.FILE_PATH, constants.F_OK)
    } catch {
      await writeFile(this.FILE_PATH, '[]')
    }
  }

  private createReadStream() {
    return createReadStream(this.FILE_PATH, 'utf-8')
  }

  private async saveContent(
    aReadStream: ReadStream,
    content: object,
  ): Promise<void> {
    const fileContent = await this.fileContent(aReadStream)
    aReadStream.on('end', async () => {
      try {
        fileContent.push(content)
        const writeStream = this.createWriteStream()
        this.write(writeStream, fileContent)
      } catch (parseError) {
        console.error('Erro ao analisar o conteúdo do arquivo:', parseError)
      }
    })
  }

  private fileContent(aReadStream: ReadStream): Promise<object[]> {
    return new Promise((resolve) => {
      aReadStream.on('data', (chunk) => {
        try {
          resolve(JSON.parse(chunk.toString()))
        } catch {
          resolve([])
        }
      })
    })
  }

  private createWriteStream(): WriteStream {
    const writeStream = createWriteStream(this.FILE_PATH, 'utf-8')
    writeStream.on('finish', () => {
      console.log('Arquivo atualizado com sucesso.')
    })
    return writeStream
  }

  private write(aWriteStream: WriteStream, content: unknown[]) {
    aWriteStream.write(JSON.stringify(content))
  }
}
