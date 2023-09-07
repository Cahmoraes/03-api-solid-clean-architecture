import getPort from 'get-port'
import request from 'supertest'
import { FastifyAdapter } from '@/infra/http/servers/fastify/fastify-adapter'
import { MainHttpController } from '@/infra/http/controllers/main-http-controller'
import { Routes } from '@/infra/http/controllers/routes.enum'
import { provideDependencies } from './utils/provide-dependencies'
import { createAndAuthenticateUser } from './utils/create-and-authenticate-user'

describe('Refresh Token (e2e)', () => {
  let fastify: FastifyAdapter
  beforeAll(async () => {
    provideDependencies()
    const port = await getPort()
    fastify = new FastifyAdapter({ port })
    new MainHttpController(fastify)
    await fastify.listen()
  })

  afterAll(async () => {
    await fastify.close()
  })

  it('should be able to refresh token', async () => {
    await createAndAuthenticateUser(fastify)

    const authResponse = await request(fastify.server)
      .post(Routes.SESSIONS)
      .send({
        email: 'johm@doe.com',
        password: '123456',
      })

    const cookies = authResponse.get('Set-Cookie')

    const refreshTokenResponse = await request(fastify.server)
      .patch(Routes.TOKEN_REFRESH)
      .set('Cookie', cookies)
      .send()

    expect(refreshTokenResponse.statusCode).toBe(200)
    expect(refreshTokenResponse.body.token).toEqual(expect.any(String))
    expect(refreshTokenResponse.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
