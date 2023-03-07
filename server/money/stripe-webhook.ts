import { getEnv } from '@larskarbo/get-env'
import Stripe from 'stripe'
import { slackNotify } from '../charts/utils/slackNotify'
import { PrismaClient } from '@prisma/client'
import { getPrisma } from '../src/utils/prisma'

const prisma = getPrisma()

const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), { apiVersion: '2020-08-27' })

export const stripeWebhook = async (req, res) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      getEnv('STRIPE_WEBHOOK_SECRET'),
    )
  } catch (err) {
    console.log(err)
    console.log(`⚠️  Webhook signature verification failed.`)
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`)
    return res.sendStatus(400)
  }
  // Extract the object from the event.
  const dataObject = event.data.object

  switch (event.type) {
    case 'checkout.session.completed':
      const { userId, billingSchedule, username, password, email } = event.data.object.metadata
      console.log('event.data.object.metadata: ', event.data.object.metadata)

      if (userId) {
        slackNotify(`New purchase from known ID: ${userId}. Purchased ${billingSchedule}`)
        prisma.user
          .update({
            where: { id: userId },
            data: {
              plan: 'premium',
              billing_schedule: billingSchedule,
              stripe_customer_id: event.data.object.customer,
            },
          })
          .then(() => {
            return res.send({})
          })
          .catch((err) => {
            console.log('err: ', err)
            return res.status(500).send({ error: err })
          })
      } else {
        // we need to create a payment token
        slackNotify(`New purchase from new user: ${username}. Purchased ${billingSchedule}`)
        // const passwordHash = await encrypt(password)

        // const userValue = await queryOne(
        //   `INSERT INTO users (username, email, password_hash, plan, billing_schedule, stripe_customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        //   [username, email, passwordHash, 'premium', billingSchedule, event.data.object.customer],
        // )

        return res.send({})
      }
      // console.log('event.data.object.metadata: ', event.data.object.metadata)

      // Payment is successful and the subscription is created.
      // You should provision the subscription.
      break
    case 'customer.subscription.deleted':
      slackNotify(`Subscription canceled by user! Need to handle`)
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break
    default:
      slackNotify(`Unhandled webhook!`)
      return res.send({ unhandled: 'OK' })
    // Unexpected event type
  }
}
