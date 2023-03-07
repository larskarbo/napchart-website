import React from 'react'

function NotFoundPage() {
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-2xl font pb-12">
        <span className="font-bold">Oh no</span> (404)
      </h1>

      <div className="w-full px-4 py-8 pt-5 mx-3 bg-white rounded-lg shadow sm:w-96">
        We could not find the page or chart you are looking for!
      </div>

      <div className="pb-16"></div>
    </div>
  )
}

export default NotFoundPage
