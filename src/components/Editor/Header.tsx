import React from 'react'
import { useChart } from './chart-context'

export const Header = ({ napchart }) => {
  const { isMyChart, updateChart, requestLoading, newChart } = useChart()

  return (
    <header
      className={`${
        requestLoading ? 'bg-gray-700' : 'bg-gray-800'
      } transition-colors pl-2 pr-4 flex justify-between items-center`}
    >
      <div className="">
        <a href="/app">{/* <Logo white height="45" loading={requestLoading} whiteBG /> */}</a>
      </div>

      <div className="flex"></div>
    </header>
  )
}

const Button = ({ onClick, className = '', disabled = false, children }) => {
  return (
    <button
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
      className={
        `
    rounded  py-2 px-4 
    ${disabled ? 'bg-gray-400' : 'bg-gray-50'}
    ${disabled ? '' : 'hover:bg-gray-100 transition-colors duration-150 hover:shadow-sm'}
    ` + className
      }
    >
      {children}
    </button>
  )
}
