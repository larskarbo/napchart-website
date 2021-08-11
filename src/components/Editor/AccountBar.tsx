import { Link } from 'gatsby'
import React from 'react'
import { CgMail, CgProfile } from 'react-icons/cg'
import { FaArrowUp } from 'react-icons/fa'
import { useUser } from '../../auth/user-context'
import Button from '../common/Button'

export const AccountBar = () => {
  const { user } = useUser()

  return (
    <div className="flex">
      {user && (
        <>
          {!user.emailVerified && (
            <Link to={`/auth/verify-email`}>
              <Button className="mt-4 mr-4 text-yellow-600" icon={<CgMail className="mr-2" />}>
                Verify email
              </Button>
            </Link>
          )}
          {!user?.isPremium && (
            <Link to={`/auth/register-premium`}>
              <Button className="mt-4 mr-4 text-green-600" icon={<FaArrowUp className="mr-2" />}>
                Upgrade
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  )
}
