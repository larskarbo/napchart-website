import clsx from "clsx"
import { Link } from 'react-router-dom'

export const SuperLink = ({ href, children, noStyle = false, ...props }) => {
  const external = href.includes("http")
  return (
    // <Link to={href}>
      <a
      href={href}
        className={clsx(
          !noStyle &&
            "underline   underline-offset-4 decoration-gray-300 hover:decoration-gray-400 opacity-80  font-medium "
        )}
        {...(external
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        {...props}
      >
        {children}
        {/* {external && <span className="text-xs">↗</span>} */}
      </a>
    // </Link> 
  )
}