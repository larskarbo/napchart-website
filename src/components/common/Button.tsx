import React from 'react'
import clsx from 'clsx'
import { navigate } from 'gatsby-link'

export default function Button({
  onClick = null,
  disabled = false,
  icon = null,
  children = null,
  className = '',
  small = false,
  linkTo = null
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
        {icon && <div className="mr-1">{icon}</div>}
        {children}
      </div>
    </button>
  )
}
