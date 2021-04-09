import Stripe from 'stripe'
import { pool, queryOne } from '../database'
import { encrypt } from '../user/authUtils/encrypt'
import { sendMail } from '../user/authUtils/mail'
import marked from "marked"
import { slackNotify } from '../charts/utils/slackNotify'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

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
      console.log('event.data.object.metadata: ', event.data.object.metadata)

      if (userId) {
        slackNotify(`New purchase from known ID: ${userId}. Purchased ${billingSchedule}`)
        pool
          .query(`UPDATE users SET plan=$1, billing_schedule=$2, stripe_customer_id=$3 WHERE id=$4`, [
            'premium',
            billingSchedule,
            event.data.object.customer,
            userId,
          ])
          .then(() => {
            return res.send({})
          })
          .catch((err) => {
            console.log('err: ', err)
            return res.status(500).send({ error: err })
          })
      } else {
        // we need to create an account
        slackNotify(`New purchase from new user: ${username}. Purchased ${billingSchedule}`)
        console.log('we need to create an account: ')
        const passwordHash = await encrypt(password)

        const userValue = await queryOne(
          `INSERT INTO users (username, email, password_hash, plan, billing_schedule, stripe_customer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [username, email, passwordHash, 'premium', billingSchedule, event.data.object.customer],
        )

        console.log('userValue: ', userValue);
        const { text, html } = makeEmail({ username: userValue.username, email: userValue.email })

        await sendMail({
          subject: 'Thanks for registering for Napchart',
          toAddress: userValue.email,
          body_html: html,
          body_text: text,
        })
        console.log('userValue: ', userValue)
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
