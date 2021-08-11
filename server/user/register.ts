import requestIp from 'request-ip'
import { pwSchema, usernameSchema } from './authUtils/userSchema'
import { publicUserObject } from '../utils/publicUserObject'
import { pool } from '../database'
import { encrypt } from './authUtils/encrypt'
import { sendValidationError } from '../utils/sendValidationError'
import { newsletterAdd } from '../charts/utils/newsletterAdd'
import { sendMail } from './authUtils/mail'
import marked from 'marked'
import { injectAccessTokenCookie } from './authUtils/injectAccessTokenCookie';

import Joi from "joi";
const schema = Joi.object({
  username: usernameSchema,
  password: pwSchema,
  email: Joi.string().email().required(),
  session_id: Joi.string().required(),
})

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const register = async (req, res) => {
  const validate = schema.validate({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    session_id: req.body.session_id,
  })

  if (validate.error) {
    return sendValidationError(res, validate.error)
  }

  const { username, email, password, session_id } = validate.value

  console.log('session_id: ', session_id)

  const session = await stripe.checkout.sessions.retrieve(session_id).catch(() => {
    return null
  })
  if(!session){
    return res.status(401).send('Invalid payment token')
  }
  const { billingSchedule } = session.metadata
  const { customer: stripeCustomerId } = session
  if(!billingSchedule || !stripeCustomerId){
    return res.status(401).send('Invalid payment session')
  }

  const passwordHash = await encrypt(password)

  pool
    .query(
      `INSERT INTO users (username, email, password_hash, ip, plan, billing_schedule, stripe_customer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [username, email, passwordHash, requestIp.getClientIp(req), "premium", billingSchedule, stripeCustomerId],
    )
    .then((hey) => {
      const userValue = hey.rows[0]
      

      newsletterAdd(email, process.env.SENDY_PREMIUM_LIST)

      const { text, html } = makeEmail({ username: userValue.username, email: userValue.email })

      sendMail({
        subject: 'Thanks for registering for Napchart',
        toAddress: userValue.email,
        body_html: html,
        body_text: text,
      })

      injectAccessTokenCookie(res, email)
      res.send(publicUserObject(hey.rows[0]))

    })
    .catch((err) => {
      if (err?.constraint == 'users_email_key') {
        res.status(400).send({ message: 'Email already exists' })
        return
      }
      if (err?.constraint == 'users_username_key') {
        res.status(400).send({ message: 'Username already exists' })
        return
      }
      if (err?.constraint == 'users_stripe_customer_id_key') {
        res.status(400).send({ message: 'It seems like you try to use a payment token twice. Contact support for help.' })
        return
      }
      res.status(400).send({ message: err.message })
    })
}

const makeEmail = ({ username, email }) => {
  const template: string = `
  Hi!

  Thanks for registering your Napchart account!

  Username: ${username}

  Email: ${email}

  Password: (the one you set)

  ----

  Your account is in the system now, you can go ahead and log in at https://napchart.com/auth/login.

  You will need to verify your email before the full feature set activates. Apologies in advance that everything is not 100% polished now as these new features are rolled out.

  Would also be awesome if you wanted to write a little introduction in the forums: https://forum.napchart.com/t/about-the-introductions-category/25

  Let me know any feedback you have!

  Feel free to reply directly to this mail.

  Best,

  Lars
  `

  const text = template

  return {
    text: text,
    html: marked(text),
  }
}
