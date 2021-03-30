import Stripe from 'stripe'
import bodyParser from 'body-parser'
import { pool } from '../database'
import { encrypt } from '../user/authUtils/encrypt';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

console.log('process.env.STRIPE_WEBHOOK_SECRET: ', process.env.STRIPE_WEBHOOK_SECRET)

export const stripeWebhook = async (req, res) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
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

      if(!userId){
        // we need to create an account
        const passwordHash = await encrypt(password)

        const userValue = await pool
        .query(`INSERT INTO users (username, email, password_hash, plan, billing_schedule, stripe_customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [
          username,
          email,
          passwordHash,
          "premium",
          billingSchedule,
          event.data.object.customer,
        ])
        console.log('userValue: ', userValue);
        return res.send({})
      }
      // console.log('event.data.object.metadata: ', event.data.object.metadata)

      pool
        .query(`UPDATE users SET plan=$1, billing_schedule=$2, stripe_customer_id=$3 WHERE id=$4`, [
          "premium",
          billingSchedule,
          event.data.object.customer,
          userId
        ])
        .then(() => {
          return res.send({})
        })
        .catch((err) => {
          console.log('err: ', err);
          return res.status(500).send({ error: err })
        })

      // Payment is successful and the subscription is created.
      // You should provision the subscription.
      break
    case 'customer.subscription.deleted':
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break
    default:
      return res.send({unhandled: "OK"})
    // Unexpected event type
  }
}
