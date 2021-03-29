import React from 'react'
import { Link } from 'gatsby'
import { useUser } from '../../auth/user-context'
import { CgMail, CgProfile } from 'react-icons/cg'
import Button from '../common/Button'

export const AccountBar = () => {
  const { user } = useUser()
  

  return (
    <div className="flex">
      {user ? (
        <>
          {!user.email_verified && (
            <Link to={`/auth/verify-email`}>
              <Button className="mt-4 mr-4 text-yellow-600" icon={<CgMail className="mr-2" />}>
                Verify email
              </Button>
            </Link>
          )}
          <Link to={`/user/${user.username}`}>
            <Button className="mt-4 mr-4" icon={<CgProfile className="mr-2" />}>
              My profile
            </Button>
          </Link>
        </>
      ) : (
        <Link to={'/auth/login'}>
          <Button className="mt-4 mr-4" icon={<CgProfile className="mr-2" />}>
            Log in
          </Button>
        </Link>
      )}
    </div>
  )
}
