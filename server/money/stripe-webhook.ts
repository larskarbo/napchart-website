import { getEnv } from '@larskarbo/get-env'
import { toNumber } from 'lodash'
import Stripe from 'stripe'
import { slackNotify } from '../charts/utils/slackNotify'
import { getPrisma } from '../src/utils/prisma'

const prisma = getPrisma()

const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), { apiVersion: '2022-11-15' })

export const stripeWebhook = async (req, res) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      getEnv('STRIPE_WEBHOOK_SECRET'),
    )

    switch (event.type) {
      case 'checkout.session.completed':
        const object = event.data.object as Stripe.Checkout.Session
        console.log('event.data: ', event.data)
        const { userId, billingSchedule } = object.metadata

        const email = object.customer_email

        if (userId) {
          slackNotify(`New purchase from known ID: ${userId}. Purchased ${billingSchedule}`)
          prisma.user
            .update({
              where: { id: toNumber(userId) },
              data: {
                plan: 'premium',
                billing_schedule: billingSchedule,
                stripe_customer_id: event.data.object,
              },
            })
            .then(() => {
              return res.send({})
            })
        } else {
          slackNotify(`New purchase from new user: ${email}. Purchased ${billingSchedule}`)
          return res.send({})
        }
        break
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        console.log(`Invoice ${invoice.id} successfully paid by ${invoice.customer_email}!`)
        // Handle successful payment here
        break
      case 'customer.subscription.deleted':
        const sub = event.data.object as Stripe.Subscription
        slackNotify(`Subscription canceled by user! Need to handle. User: ${sub.customer}`)
        if (event.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log(`Invoice ${failedInvoice.id} failed to be paid by ${failedInvoice.customer_email}!`)
        break

      default:
        slackNotify(`Unhandled event type: ${event.type}`)
        return res.send({ unhandled: 'OK' })
      // Unexpected event type
    }

    return res.send({ unhandled: 'OK' })
  } catch (err) {
    slackNotify(`⚠️  Webhook signature verification failed.`)
    return res.sendStatus(400)
  }
}
