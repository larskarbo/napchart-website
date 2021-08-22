import { getEnv } from '@larskarbo/get-env'
import { WEB_BASE } from '../utils/webBase'

const stripe = require('stripe')(getEnv('STRIPE_SECRET_KEY'))

export const customerPortal = async (req, res) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: req.params.stripeCustomerId,
    return_url: `${WEB_BASE}/user/${req.user.username}`,
  })

  res.redirect(session.url)
}
