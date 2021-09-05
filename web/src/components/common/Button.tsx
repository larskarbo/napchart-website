import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'

import { FaSpinner } from 'react-icons/fa';

export default function Button({
  onClick = null,
  disabled = false,
  icon = null,
  children = null,
  className = '',
  small = false,
  linkTo = null,
  loading = false,
}) {
  const router = useRouter()

  const link = () => {
    if(linkTo){
      router.push(linkTo)
    }
  }
  return (
    <button
      className={clsx(className, 'bbutton', small ? 'bbutton-small' : '')}
      onClick={disabled ? null : onClick || link}
      disabled={disabled}
    >
      <div className=" flex items-center">
        {(icon && !loading) && <div className="mr-1">{icon}</div>}
        {(loading) && <div className="mr-1"><FaSpinner className="animate-spin" /></div>}
        {children}
      </div>
    </button>
  )
}
