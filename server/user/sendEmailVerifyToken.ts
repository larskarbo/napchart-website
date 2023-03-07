import marked from 'marked'
import requestIp from 'request-ip'
import { getPrisma } from '../src/utils/prisma'
import { PublicUserObject } from '../utils/publicUserObject'
import { WEB_BASE } from '../utils/webBase'
import { sendMail } from './authUtils/mail'
import { genToken } from './sendPasswordResetToken'

export const sendEmailVerifyTokenEndpoint = async (req, res) => {
  const userValue: PublicUserObject = req.user
  if (!userValue) {
    res.status(401).send({ message: 'email not found' })
    return
  }

  if (userValue.emailVerified) {
    res.status(400).send({ message: 'Email already verified.' })
  }

  sendEmailVerificationOnly(userValue, req.userId, req)
    .then(() => {
      res.send({ status: 'done' })
    })
    .catch((err) => {
      console.log('err: ', err)
      res.status(400).send({ message: 'Mail error' })
    })
}

const prisma = getPrisma()

export const sendEmailVerificationOnly = async (userValue: PublicUserObject, userId, req) => {
  return prisma.user_token
    .create({
      data: {
        token: genToken(),
        token_type: 'email_verify',
        user_id: userId,
        ip: requestIp.getClientIp(req),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
    .then((token) => {
      const { text, html } = makeEmail(token.token)
      return sendMail({
        subject: 'Napchart Verify Email',
        toAddress: userValue.email,
        body_html: html,
        body_text: text,
      })
    })
}

const makeEmail = (utoken) => {
  const link = `${WEB_BASE}/auth/verify-email?utoken=${utoken}`
  const template: string = `
  Hi!
  
  Here is the link for verifying your email at Napchart: LINK

  If you never registered on Napchart, please ignore this email.

  Best,

  Lars
  `
  const text = template.replaceAll('LINK', link)

  return {
    text: text,
    html: marked(text),
  }
}
