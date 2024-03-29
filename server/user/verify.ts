import { getEnv } from '@larskarbo/get-env'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { publicUserObject } from '../utils/publicUserObject'

const prisma = new PrismaClient()

export const verify = (type: 'optional' | 'normal' | 'no-email-check') => async (req, res, next) => {
  let accessToken = req.cookies.jwt

  //if there is no token stored in cookies, the request is unauthorized
  if (!accessToken) {
    if (type == 'optional') {
      return next()
    }
    return res.status(403).send({ message: 'No access token present' })
  }

  let payload
  try {
    //use the jwt.verify method to verify the access token
    //throws an error if the token has expired or has a invalid signature
    payload = jwt.verify(accessToken, getEnv('ACCESS_TOKEN_SECRET'))
    const user = await prisma.user.findUnique({ where: { email: payload.email } })

    if (user) {
      if (user.email_verified || type == 'no-email-check') {
        req.user = publicUserObject(user)
        req.userId = user.id
        next()
        return
      } else {
        if (type == 'optional') {
          return next()
        }
        return res.status(401).send({
          message: 'Oops, looks like you need to verify your email.',
        })
      }
      return
    }
    return res.status(401).send()
  } catch (e) {
    console.log(e)
    //if an error occured return request unauthorized error
    return res.status(401).send()
  }
}
