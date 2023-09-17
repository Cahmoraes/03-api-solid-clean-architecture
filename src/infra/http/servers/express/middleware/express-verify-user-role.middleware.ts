import { Role } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'

export function expressVerifyUserRole(roleToVerify: Role) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { role } = request.user
    console.log({ role })
    if (role !== roleToVerify) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    return next()
  }
}
