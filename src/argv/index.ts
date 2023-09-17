import { z } from 'zod'

const serverArgvSchema = z
  .enum(['express', 'fastify'])
  .default('fastify')
  .transform((value) => value.toUpperCase())

type argvOutput = Uppercase<NonNullable<z.input<typeof serverArgvSchema>>>

const _serverArgv = serverArgvSchema.safeParse(process.argv[2])

/* c8 ignore start */
if (!_serverArgv.success) {
  console.error(`❌ Invalid argv variable: ${_serverArgv.error.format()}`)
  throw new Error(`❌ Invalid argv variable: ${_serverArgv.error.format()}`)
}

export const serverArgv: argvOutput = _serverArgv.data as argvOutput
