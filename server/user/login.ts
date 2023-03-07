import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { injectAccessTokenCookie } from './authUtils/injectAccessTokenCookie'

const prisma = new PrismaClient()

export const login = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log('email: ', email)
    res.status(401).send({ message: 'email not found' })
    return
  }

  const result = await new Promise((resolve) => {
    bcrypt.compare(password, user.password_hash, function (err, result) {
      resolve(result)
    })
  })

  if (!result) {
    res.status(401).send({ message: 'wrong password' })
    return
  }

  injectAccessTokenCookie(res, email)

  res.send(user)
}
