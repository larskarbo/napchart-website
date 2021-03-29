import React from 'react'
import clsx from 'clsx'
import { navigate } from 'gatsby-link'
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
  const link = () => {
    if(linkTo){
      navigate(linkTo)
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
