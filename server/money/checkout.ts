import Stripe from "stripe"
import { isDev, WEB_BASE } from '../utils/webBase';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {apiVersion:"2020-08-27"});

const prices = {
  monthly: 'price_1IaPMXLugp7Sf5UQVU7KZNvA',
  yearly: 'price_1IaPMXLugp7Sf5UQCFHZuDNU',
  lifetime: 'price_1IaPMXLugp7Sf5UQpLHOFXai',
}

export const checkout = async function (req, res) {
  const { type } = req.body;
  const priceId = prices[type]

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    let config = {}
    if(type == "lifetime"){
      config = {
        mode: "payment",
      }
    } else {
      config = {
        mode: "subscription",
      }
      
    }
    const session = await stripe.checkout.sessions.create({
      ...config,
      payment_method_types: ["card"],
      metadata: {
        // user_id: user.sub,
        // user_email: user.email,
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
      success_url: `${WEB_BASE}/app?session_id={CHECKOUT_SESSION_ID}` ,
      cancel_url: `${WEB_BASE}/app?payment_canceled`,
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    console.log("error", e.message)
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
};