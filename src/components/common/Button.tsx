import React from 'react'
import clsx from 'clsx'

export default function Button(
  {
    onClick=() => {},
    disabled=false,
    icon=null,
    children="",
    className="",
    small=false
  }
) {
  return (
    <button className={clsx(className, "bbutton", small ? "bbutton-small" : "")} onClick={disabled ? null : onClick} disabled={disabled}>
      <div className=" flex items-center">
        {icon && <div className="mr-1">{icon}</div>}
        {children}
      </div>
    </button>
  )
}
