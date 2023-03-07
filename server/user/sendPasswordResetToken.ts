import Joi from 'joi'
import marked from 'marked'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'
import requestIp from 'request-ip'
import { getPrisma } from '../src/utils/prisma'
import { sendValidationError } from '../utils/sendValidationError'
import { WEB_BASE } from '../utils/webBase'
import { sendMail } from './authUtils/mail'
export const genToken = customAlphabet(alphanumeric, 48)

const schema = Joi.object({
  email: Joi.string().email().required(),
})

const prisma = getPrisma()

export const sendPasswordResetTokenEndpoint = async (req, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { email } = validate.value

  const userValue = await prisma.user.findUnique({ where: { email } })
  if (!userValue) {
    res.status(401).send({ message: 'email not found' })
    return
  }

  prisma.user_token
    .create({
      data: {
        token: genToken(),
        token_type: 'password_reset',
        user_id: userValue.id,
        ip: requestIp.getClientIp(req),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
    .then((token) => {
      const { text, html } = makeEmail(token.token)
      sendMail({
        subject: 'Napchart Password Reset',
        toAddress: userValue.email,
        body_html: html,
        body_text: text,
      }).then(() => {
        res.send({ status: 'done' })
      })
    })
    .catch((err) => {
      console.log('err: ', err)
      res.status(400).send({ error: err })
    })
}

const makeEmail = (utoken) => {
  const link = `${WEB_BASE}/auth/set-password?utoken=${utoken}`
  const template: string = `
  Hi!
  
  Here is the link for setting the password for Napchart: LINK

  Let me know if you have problems setting the password!

  Best,

  Lars
  `
  const text = template.replaceAll('LINK', link)

  return {
    text: text,
    html: marked(text),
  }
}
