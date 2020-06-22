import React, { FunctionComponent } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

type HeaderElementProps = {
  onClick: () => void
  style: any
  href: string
  className: string
  right: any
  children: any
}
export const HeaderElement: FunctionComponent<HeaderElementProps> = ({
  onClick,
  style,
  href,
  className,
  right,
  children,
}) => {
  let onClickFn: any
  if (typeof onClick == 'undefined') {
    onClickFn = () => {}
  } else {
    onClickFn = onClick
  }
  return (
    <Link
      style={style}
      to={href}
      className={classNames('HeaderElement', className, { right: right })}
      onClick={onClickFn}
    >
      <span>{children}</span>
    </Link>
  )
}
