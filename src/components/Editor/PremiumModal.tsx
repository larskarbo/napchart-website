import React, { useRef, useState } from 'react'

import useOnClickOutside from 'use-onclickoutside'
import ReactPlayer from 'react-player/vimeo'
import { useUser } from '../../auth/user-context'
import { CgProfile } from 'react-icons/cg'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Link } from 'gatsby'

enum Plan {
  Monthly = 'monthly',
  Yearly = 'yearly',
  Lifetime = 'lifetime',
}

let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUB_KEY)
  }
  return stripePromise
}

export const PremiumModal = ({ exit }) => (
  <Elements stripe={getStripe()}>
    <PremiumModalReal exit={exit} />
  </Elements>
)

const PremiumModalReal = ({ exit }) => {
  const [plan, setPlan] = useState<Plan>(Plan.Lifetime)
  const { user } = useUser()
  const ref = useRef(null)
  useOnClickOutside(ref, exit)

  return (
    <div className="py-12 bg-black bg-opacity-70 absolute top-0 left-0 right-0 bottom-0 z-20 flex center">
      <div ref={ref} className="flex h-full w-full max-w-5xl p-4 bg-white shadow-xl rounded-lg">
        <div className="flex-1 p-8 pt-12 border-r">
          <h2 className="font-bold text-3xl">Napchart Premium</h2>
          <div
            className="relative w-full overflow-hidden rounded-xl my-8 shadow-xl"
            style={{
              paddingTop: 100 / (1920 / 1080) + '%',
            }}
          >
            <ReactPlayer
              className="absolute top-0 left-0"
              controls={true}
              url="https://player.vimeo.com/video/522303152"
              width="100%"
              height="100%"
            />
          </div>
          <ul className="pl-8 ">
            <li className="my-4 font-medium text-lg">Dark-mode support</li>
            <li className="my-4 font-medium text-lg">Redlight-mode support</li>
            <li className="my-4 font-medium text-lg">High quality image exports</li>
            <li className="my-4 font-medium text-lg">Email export</li>
            <li className="my-4 font-medium text-lg">Access to our insider community</li>
            <li className="my-4 font-medium text-lg">Support Napchart</li>
          </ul>
        </div>

        <div className="flex-1 p-8 pt-12">
          <h2 className="mb-8 font-medium text-gray-800 text-lg text-center uppercase">Plan</h2>
          <div className="bg-gray-50 text-center border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setPlan(Plan.Monthly)}
              className={`py-6 w-full m-0
                    ${plan == Plan.Monthly && 'bg-red-500 text-white'}
                `}
            >
              <span className="font-bold">Monthly: 4$/month</span>
            </button>
            <button
              onClick={() => setPlan(Plan.Yearly)}
              className={`py-6 w-full m-0
                    ${plan == Plan.Yearly && 'bg-red-500 text-white'}
                `}
            >
              <span className="font-bold">Yearly: 40$/year</span>
            </button>
            <button
              onClick={() => setPlan(Plan.Lifetime)}
              className={`py-6 w-full m-0
                    ${plan == Plan.Lifetime && 'bg-red-500 text-white'}
                `}
            >
              <span className="font-bold">Lifetime: 70$</span>
            </button>
          </div>

          <h2 className="my-8 font-medium text-gray-800 text-lg text-center uppercase">User</h2>

          {user ? (
            <>
              <div
                className="mt-4 mr-4 flex items-center border border-gray-200 rounded p-2 px-4
      hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
      "
              >
                <div>
                  Logged in as <strong>{user.username}</strong> (<span className="text-gray-500">{user.email}</span>)
                </div>
              </div>
            </>
          ) : (
            <Link to="/auth/login">
              <button className=" w-full bbutton mt-4 mr-4">
                <div className="font-bold flex items-center">
                  <CgProfile className="mr-2" /> Log in
                </div>
              </button>
            </Link>
          )}

          <h2 className="my-8 font-medium text-gray-800 text-lg text-center uppercase">Payment</h2>

          <CheckoutForm />
        </div>
      </div>
    </div>
  )
}

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (error) {
      console.log('[error]', error)
    } else {
      console.log('[PaymentMethod]', paymentMethod)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" className="bbutton mt-8 mr-4 w-full bg-green-50" disabled={!stripe}>
        Become a Premium member!
      </button>
    </form>
  )
}
