import React from 'react'
import Footer from './Footer'
import Nav from './Nav'

export default function NewLayout({ children, activeRoute }) {
  return (
    <>
      <Nav activeRoute={activeRoute} />

      <div className=" w-full min-h-screen pt-12 flex flex-col items-center bg-gray-50">
        <div className="max-w-5xl w-full">{children}</div>

        <Footer />
      </div>
    </>
  )
}

export function MainBox({ children }) {
  return <div className="w-full mx-auto mt-4 px-12 py-8 pt-5  bg-white rounded-lg shadow ">{children}</div>
}
