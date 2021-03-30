import Joi from 'joi'
import Stripe from 'stripe'
import { isDev, WEB_BASE } from '../utils/webBase'
import { pwSchema, usernameSchema } from '../user/authUtils/userSchema'
import { sendValidationError } from '../utils/sendValidationError'
import { queryOne } from '../database'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

const prices = {
  monthly: isDev ? 'price_1IaPMXLugp7Sf5UQVU7KZNvA' : 'price_1IaeHPLugp7Sf5UQrTAHxuK7',
  yearly: isDev ? 'price_1IaPMXLugp7Sf5UQCFHZuDNU' : 'price_1IaeHPLugp7Sf5UQiy04tydB',
  lifetime: isDev ? 'price_1IaPMXLugp7Sf5UQpLHOFXai' : 'price_1IaeHPLugp7Sf5UQA2ZIElr5',
}

const schema = Joi.object({
  username: usernameSchema,
  password: pwSchema,
  email: Joi.string().email().required(),
  billingSchedule: Joi.any(),
})

export const checkout = async function (req, res) {
  const { billingSchedule } = req.body
  const priceId = prices[billingSchedule]

  const validate = schema.validate(req.body)

  const { username, password, email } = validate?.value || {}

  if (!req.user) {
    if (validate.error) {
      sendValidationError(res, validate.error)
      return
    }

    const existsUsername = await queryOne(`SELECT * from users WHERE username = $1`, [username])
    if (existsUsername) {
      res.status(401).send({ message: 'Username taken' })
    }
    const existsEmail = await queryOne(`SELECT * from users WHERE email = $1`, [email])
    if (existsEmail) {
      res.status(401).send({ message: 'Email is already in use' })
    }
  }

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    let config = {}
    if (billingSchedule == 'lifetime') {
      config = {
        mode: 'payment',
      }
    } else {
      config = {
        mode: 'subscription',
      }
    }
    const session = await stripe.checkout.sessions.create({
      ...config,
      payment_method_types: ['card'],
      metadata: {
        userId: req.user?.id,
        billingSchedule: billingSchedule,
        username,
        password,
        email,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${WEB_BASE}/auth/login?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEB_BASE}/auth/register-premium?payment_canceled`,
    })

    res.send({
      sessionId: session.id,
    })
  } catch (e) {
    console.log('error', e.message)
    res.status(400)
    return res.send({
      error: {
        message: e.message,
      },
    })
  }
}
