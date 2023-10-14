import Redis from 'ioredis'
import { CacheRepository } from '../cache-repository'
import { env } from '@/env'

export class RedisRepository implements CacheRepository {
  private redisService: Redis
  private FIFTEEN_MINUTES = 60 * 15

  constructor() {
    this.redisService = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      db: env.REDIS_DB,
      password: env.REDIS_PASSWORD,
    })
  }

  async clear(): Promise<void> {
    this.redisService.flushall()
  }

  async set(key: string, value: string): Promise<void> {
    this.redisService.set(key, value, 'EX', this.FIFTEEN_MINUTES)
  }

  async get(key: string): Promise<string | null> {
    return this.redisService.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redisService.del(key)
  }
}
