import React from 'react'

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
    </div>
  )
}
