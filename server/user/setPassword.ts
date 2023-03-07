import { PrismaClient } from '@prisma/client'
import Joi from 'joi'
import { sendValidationError } from '../utils/sendValidationError'
import { encrypt } from './authUtils/encrypt'
import { pwSchema } from './authUtils/userSchema'

const schema = Joi.object({
  password: pwSchema,
  token: Joi.string().required(),
})

const prisma = new PrismaClient()

export const setPassword = async (req, res) => {
  const validate = schema.validate({
    token: req.body.token,
    password: req.body.password,
  })

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { token, password } = validate.value

  const userTokenDoc = await prisma.user_token.findFirst({ where: { token } })
  if (!userTokenDoc || userTokenDoc.token_type !== 'password_reset') {
    res.status(401).send({ success: false, message: 'invalid token' })
    return
  }

  const passwordHash = await encrypt(password)

  prisma.user
    .update({
      where: { id: userTokenDoc.user_id },
      data: { password_hash: passwordHash, email_verified: true },
    })
    .then((user) => {
      res.send({
        success: true,
      })
    })
    .catch((err) => {
      res.status(400).send({ err: err })
    })
}
