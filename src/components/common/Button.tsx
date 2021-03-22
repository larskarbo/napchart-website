import React from 'react'

export default function Button(
  {
    onClick=() => {},
    disabled=false,
    icon=null,
    children="",
    className=""
  }
) {
  return (
    <button className={`${className} button`} onClick={disabled ? null : onClick} disabled={disabled}>
      <div className=" flex items-center">
        {icon && <div className="mr-1">{icon}</div>}
        {children}
      </div>
    </button>
  )
}
