import React, { useRef, useState } from 'react'

import useOnClickOutside from 'use-onclickoutside'

enum Plan {
  Monthly = 'monthly',
  Yearly = 'yearly',
  Lifetime = 'lifetime',
}

export const PremiumModal = ({ exit }) => {
  const [plan, setPlan] = useState<Plan>(Plan.Lifetime)
  const ref = useRef(null)
  useOnClickOutside(ref, exit)

  return (
    <div className="py-12 bg-black bg-opacity-70 absolute top-0 left-0 right-0 bottom-0 z-20 flex center">
      <div ref={ref} className="flex h-full w-full max-w-5xl p-4 bg-white shadow-xl rounded-lg">
        <div className="flex-1 p-8 border-r">
          <h2 className="font-bold text-3xl">Napchart Premium</h2>
          <div className="w-full my-8 h-48 bg-gray-200 rounded"> video </div>
          <ul className="pl-8">
            <li className="my-4 font-medium text-lg">Dark-mode support</li>
            <li className="my-4 font-medium text-lg">Redlight-mode support</li>
            <li className="my-4 font-medium text-lg">High quality image exports</li>
            <li className="my-4 font-medium text-lg">Email export</li>
            <li className="my-4 font-medium text-lg">Access to our insider community</li>
            <li className="my-4 font-medium text-lg">Support Napchart</li>
          </ul>
        </div>

        <div className="flex-1 p-8">
          <div className="bg-gray-50 text-center border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setPlan(Plan.Monthly)}
              className={`py-6 block w-full m-0
                    ${plan == Plan.Monthly && 'bg-red-500 text-white'}
                `}
            >
              <span className="font-bold">Monthly: 4$/month</span>
            </button>
            <button
              onClick={() => setPlan(Plan.Yearly)}
              className={`py-6 block w-full m-0
                    ${plan == Plan.Yearly && 'bg-red-500 text-white'}
                `}
            >
              <span className="font-bold">Yearly: 40$/year</span>
            </button>
            <button
              onClick={() => setPlan(Plan.Lifetime)}
              className={`py-6 block w-full m-0
                    ${plan == Plan.Lifetime && 'bg-red-500 text-white'}
                `}
            >
              <span className="font-bold">Lifetime: 70$</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
