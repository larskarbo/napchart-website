import Joi from 'joi'
import marked from 'marked'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'
import { pool } from '../database'
import { sendValidationError } from '../utils/sendValidationError'
import { sendMail } from './authUtils/mail'
import requestIp from 'request-ip'
import { WEB_BASE } from '../utils/webBase'
import { PublicUserObject } from '../utils/publicUserObject'
const genToken = customAlphabet(alphanumeric, 48)

export const sendEmailVerifyTokenEndpoint = async (req, res) => {
  const userValue:PublicUserObject = req.user
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
      res.status(400).send({ message: "Mail error" })
    })
}

const sendEmailVerificationOnly = async (userValue: PublicUserObject, userId, req) => {
  return pool
    .query(
      `INSERT INTO user_tokens (token, password_reset, user_id, ip, expires_at) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 day') RETURNING *`,
      [genToken(), false, userId, requestIp.getClientIp(req)],
    )
    .then((hey) => {
      const { text, html } = makeEmail(hey.rows[0].token)
      console.log('text: ', text)
      // // transporter
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
