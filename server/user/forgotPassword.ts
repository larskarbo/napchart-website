import Joi from 'joi'
import marked from 'marked'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'
import { pool } from '../database'
import { sendValidationError } from '../utils/sendValidationError'
import { sendMail } from './authUtils/mail'
import requestIp from 'request-ip'
import { WEB_BASE } from '../utils/webBase'
const genToken = customAlphabet(alphanumeric, 48)

const schema = Joi.object({
  email: Joi.string().email().required(),
})

export const forgotPassword = async (req, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { email } = validate.value

  const userValue = (await pool.query('SELECT * FROM users WHERE email = $1', [email]))?.rows?.[0]
  if (!userValue) {
    res.status(401).send({ message: 'email not found' })
    return
  }

  pool
    .query(
      `INSERT INTO user_tokens (token, password_reset, user_id, ip, expires_at) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 day') RETURNING *`,
      [genToken(), true, userValue.id, requestIp.getClientIp(req)],
    )
    .then((hey) => {
      const { text, html } = makeEmail(hey.rows[0].token)
      console.log('text: ', text)
      // // transporter
      sendMail({
        subject: 'Imitate Password Reset',
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
  
  Here is the link for setting the password for Imitate: LINK

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
