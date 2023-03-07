import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { getErrorMessage } from 'get-error-message'
import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player/vimeo'
import { useUser } from '../../auth/user-context'
import Button from '../../components/common/Button'
import { request } from '../../utils/request'
import { useNotyf } from '../../utils/requestHooks'

enum Plan {
  Monthly = 'monthly',
  Yearly = 'yearly',
  Lifetime = 'lifetime',
}

let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY)
  }
  return stripePromise
}

export default function PremiumPage({ exit }) {
  return (
    <Elements stripe={getStripe()}>
      <PremiumPageReal exit={exit} />
    </Elements>
  )
}

const PremiumPageReal = ({ exit }) => {
  const [plan, setPlan] = useState<Plan>(Plan.Lifetime)
  const { user } = useUser()

  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-yellow-50">
      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow max-w-4xl my-24 flex">
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
          <ul className="pl-2 ">
            <li className="my-4 font-medium">Account and saving</li>
            <ul className="list-disc ml-8 font-light text-sm">
              <li className="my-1">👤 Create user accounts</li>
              <li className="my-1">Save charts to your profile.</li>
              <li className="my-1">Update your charts without changing the link.</li>
              <li className="my-1">Delete your charts.</li>
              <li className="my-1">
                🔒 Make charts <strong>private</strong>.
              </li>
            </ul>
            <li className="my-4 font-medium">Napchart editor</li>
            <ul className="list-disc ml-8 font-light text-sm">
              <li className="my-1">Custom colors.</li>
              <li className="my-1">High-res image export.</li>
              <li className="my-1">
                Fully featured dark-mode. <i>(coming soon)</i>
              </li>
            </ul>
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

          {/* <h2 className="my-8 font-medium text-gray-800 text-lg text-center uppercase">User</h2>
           */}
          {user && (
            <div
              className="mt-4 mr-4 flex items-center border border-gray-200 rounded p-2 px-4
      hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
      "
            >
              <div>
                Logged in as <strong>{user.username}</strong> (<span className="text-gray-500">{user.email}</span>)
              </div>
            </div>
          )}

          {user?.isPremium ? (
            <div className="my-8">You are already a premium member!</div>
          ) : (
            <CheckoutForm plan={plan} />
          )}
        </div>
      </div>
    </div>
  )
}

const CheckoutForm = ({ plan }) => {
  console.log('plan: ', plan)
  const formRef = useRef()
  const stripe = useStripe()
  const notyf = useNotyf()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe) {
      notyf.error('Stripe is still loading, wait a few seconds and try again.')
      request('POST', '/reportError', {
        text: 'Client error: Stripe is still loading, wait a few seconds and try again.',
      })
    }

    // @ts-ignore
    const email = formRef?.current?.email?.value
    // @ts-ignore
    const password = formRef?.current?.password?.value
    // @ts-ignore
    const username = formRef?.current?.username?.value

    if (!user) {
    }

    setLoading(true)
    return request('POST', '/money/checkout', {
      billingSchedule: plan,
      email,
      password,
      username,
    })
      .then(async function (result: any) {
        console.log('result: ', result)
        await stripe
          .redirectToCheckout({
            sessionId: result.sessionId,
          })
          .then((res) => {})
      })
      .catch((err) => {
        notyf.error(getErrorMessage(err))
        request('POST', '/reportError', {
          text: `Client payment error: ${getErrorMessage(err)} ${email} ${username} ${plan}`,
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form ref={formRef} className="mt-4" onSubmit={handleSubmit}>
      {user ? <></> : <></>}

      {/* <CardElement /> */}
      <Button loading={loading} className="bbutton  mr-4 w-full bg-green-400 text-white font-medium">
        Become a Premium member!
      </Button>
    </form>
  )
}
