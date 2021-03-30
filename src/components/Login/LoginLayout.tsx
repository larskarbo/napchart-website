import React from 'react'
import { Contact } from '../Editor/sections/Info'

export default function LoginLayout({ children, msg = '' }) {
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-2xl font pb-12">
        <span className="font-bold">Napchart</span> is waiting for you
      </h1>

      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow sm:w-96">
        {msg && <div className="text-red-600 pb-4">{msg}</div>}
        {children}
      </div>

      {/* <span className="my-2 text-sm opacity-50">
        No account yet?{" "}
        <a className="underline" href="/register">
          Login
        </a>
      </span> */}

      <div className="pb-16"></div>
      <div className="my-4 text-sm text-gray-800">
        <p>
          <strong>✉️ Need help?</strong> Reach out to me on{' '}
          <a className="underline text-blue-500" href="https://twitter.com/larskarbo">
            twitter
          </a>{' '}
          or{' '}
          <a className="underline text-blue-500" href="mailto:lars@napchart.com">
            mail
          </a>
          .
        </p>
      </div>
    </div>
  )
}
