import React from 'react'

export const SubmitButton = ({ children }) => {
  return (
    <div className="mb-4">
      <button
        type="submit"
        className="shadow-sm w-full flex justify-center cursor-pointer py-2 px-4 border
                border-transparent text-sm font-medium rounded-md text-white bg-gray-700
                 focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
      >
        {children}
      </button>
    </div>
  )
}
