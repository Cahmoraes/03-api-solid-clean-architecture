import { DomainEventSubscriber } from '../domain-event-subscriber'
import { DomainEvents } from '../domain-events.enum'
import {
  UserAuthenticatedEvent,
  UserAuthenticatedProps,
} from './user-authenticated.event'
import { join } from 'path'
import {
  ReadStream,
  WriteStream,
  createReadStream,
  createWriteStream,
} from 'fs'
import { access, constants, writeFile } from 'fs/promises'

interface UserAuthenticatedLog {
  email: string
  id: string
}

export class UserAuthenticatedSubscriber implements DomainEventSubscriber {
  public readonly eventType: string
  private readonly FILE_NAME = 'sessions.json'
  private readonly FILE_PATH = join(process.cwd(), 'log', this.FILE_NAME)

  constructor() {
    this.eventType = DomainEvents.USER_AUTHENTICATED
  }

  public handleEvent(aDomainEvent: UserAuthenticatedEvent): void {
    console.log(aDomainEvent.data)
    this.writeFile(aDomainEvent.data)
  }

  private async writeFile({
    id,
    email,
  }: UserAuthenticatedProps): Promise<void> {
    try {
      await this.createFileIfNotExists()
      const readStream = this.createReadStream()
      await this.saveContent(readStream, { id: id.toString(), email })
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
    content: UserAuthenticatedLog,
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

  private fileContent(
    aReadStream: ReadStream,
  ): Promise<UserAuthenticatedLog[]> {
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
