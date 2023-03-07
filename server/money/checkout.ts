import { getEnv } from '@larskarbo/get-env'
import Joi from 'joi'
import Stripe from 'stripe'
import { pwSchema, usernameSchema } from '../user/authUtils/userSchema'
import { isDev, WEB_BASE } from '../utils/webBase'
const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), { apiVersion: '2020-08-27' })

const prices = {
  monthly: isDev ? 'price_1IaPMXLugp7Sf5UQVU7KZNvA' : 'price_1IaeHPLugp7Sf5UQrTAHxuK7',
  yearly: isDev ? 'price_1IaPMXLugp7Sf5UQCFHZuDNU' : 'price_1IaeHPLugp7Sf5UQiy04tydB',
  lifetime: isDev ? 'price_1IaPMXLugp7Sf5UQpLHOFXai' : 'price_1IanNQLugp7Sf5UQKOtT2oQJ',
}

const discountsObj = {
  poisonsamurai: 'promo_1IanRfLugp7Sf5UQXFurjojB',
  mammoth: 'promo_1IanRfLugp7Sf5UQrU1kHwlg',
  barrow: 'promo_1Igwd0Lugp7Sf5UQFF6vS3NB',
  enteleform: 'promo_1IanRfLugp7Sf5UQ1B98eWJ2',
  larskarbo: 'promo_1IanVQLugp7Sf5UQeyIuV1Ba', // <- test
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
    let discounts = []
    console.log('req.user: ', req.user)
    console.log('billingSchedule: ', billingSchedule)
    if (discountsObj[req.user?.username] && billingSchedule == 'lifetime') {
      discounts = [{ promotion_code: discountsObj[req.user.username] }]
      console.log('discounts: ', discounts)
    }
    const session = await stripe.checkout.sessions.create({
      ...config,
      payment_method_types: ['card'],
      discounts: discounts,
      metadata: {
        userId: req.userId,
        billingSchedule: billingSchedule,
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
      success_url: `${WEB_BASE}/auth/register?session_id={CHECKOUT_SESSION_ID}`,
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
