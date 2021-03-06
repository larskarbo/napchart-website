import React from 'react'
import { Link } from 'gatsby'
import { useUser } from '../../auth/user-context'
import { CgProfile } from 'react-icons/cg'

export const AccountBar = () => {
  const { user } = useUser()

  return (
    <Link to={user ? `/@${user.username}` : '/login'}>
      <div
        className="mt-4 mr-4 flex items-center border border-gray-200 rounded p-2 px-4
      hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
      "
      >
        {user ? (
          <>
            {/* <img
              alt="Lars"
              className="rounded-full mr-2 w-8"
              src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
            /> */}
            <div className="font-bold flex items-center">
              <CgProfile className="mr-2" /> My profile
            </div>
          </>
        ) : (
          <>
            <div className="font-bold flex items-center">
              <CgProfile className="mr-2" /> Log in
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
