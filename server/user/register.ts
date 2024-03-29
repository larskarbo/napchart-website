import { getEnv } from '@larskarbo/get-env'
import { PrismaClient } from '@prisma/client'
import Joi from 'joi'
import marked from 'marked'
import requestIp from 'request-ip'
import { publicUserObject } from '../utils/publicUserObject'
import { sendValidationError } from '../utils/sendValidationError'
import { encrypt } from './authUtils/encrypt'
import { injectAccessTokenCookie } from './authUtils/injectAccessTokenCookie'
import { sendMail } from './authUtils/mail'
import { pwSchema, usernameSchema } from './authUtils/userSchema'

const prisma = new PrismaClient()

const stripe = require('stripe')(getEnv('STRIPE_SECRET_KEY'))
const schema = Joi.object({
  username: usernameSchema,
  password: pwSchema,
  email: Joi.string().email().required(),
  session_id: Joi.string().required(),
})


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
  if (!session) {
    return res.status(401).send('Invalid payment token')
  }
  const { billingSchedule } = session.metadata
  const { customer: stripeCustomerId } = session
  if (!billingSchedule || !stripeCustomerId) {
    return res.status(401).send('Invalid payment session')
  }

  const passwordHash = await encrypt(password)

  prisma.user
    .create({
      data: {
        username,
        email,
        password_hash: passwordHash as string,
        ip: requestIp.getClientIp(req),
        plan: 'premium',
        billing_schedule: billingSchedule,
        stripe_customer_id: stripeCustomerId,
      },
    })
    .then((userValue) => {
      const { text, html } = makeEmail({ username: userValue.username, email: userValue.email })

      sendMail({
        subject: 'Thanks for registering for Napchart',
        toAddress: userValue.email,
        body_html: html,
        body_text: text,
      })

      injectAccessTokenCookie(res, email)
      res.send(publicUserObject(userValue))
    })
    .catch((err) => {
      if (err?.meta?.cause?.code == '23505' && err?.meta?.cause?.constraint == 'users_email_key') {
        res.status(400).send({ message: 'Email already exists' })
        return
      }
      if (err?.meta?.cause?.code == '23505' && err?.meta?.cause?.constraint == 'users_username_key') {
        res.status(400).send({ message: 'Username already exists' })
        return
      }
      if (err?.meta?.cause?.code == '23505' && err?.meta?.cause?.constraint == 'users_stripe_customer_id_key') {
        res
          .status(400)
          .send({ message: 'It seems like you try to use a payment token twice. Contact support for help.' })
        return
      }
      res.status(400).send({
        message: err.message,
      })
    })
}

const makeEmail = ({ username, email }) => {
  const template: string = `
      Hi!
      
      Thanks for registering your Napchart account!
      
      Username: ${username}
      
      Email: ${email}
      
      Password: (the one you set)
      
      Your account is in the system now, you can go ahead and log in at https://napchart.com/auth/login.
      
      You will need to verify your email before the full feature set activates. Apologies in advance that everything is not 100% polished now as these new features are rolled out.
      
      Let me know any feedback you have!
      
      Feel free to reply directly to this mail.
      
      Best,
      
      Lars
      `
  // Would also be awesome if you wanted to write a little introduction in the forums: https://forum.napchart.com/t/about-the-introductions-category/25

  const text = template

  return {
    text: text,
    html: marked(text),
  }
}
