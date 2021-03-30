import React from 'react'
import { Link } from 'gatsby'
import { useUser } from '../../auth/user-context'
import { CgMail, CgProfile, CgPushUp } from 'react-icons/cg'
import Button from '../common/Button'
import {PublicUserObject} from "../../../server/utils/publicUserObject"
import { FaArrowUp, FaUps } from 'react-icons/fa'

export const AccountBar = () => {
  const { user } = useUser()
  console.log('user: ', user);
  

  return (
    <div className="flex">
      {user ? (
        <>
          {!user.emailVerified && (
            <Link to={`/auth/verify-email`}>
              <Button className="mt-4 mr-4 text-yellow-600" icon={<CgMail className="mr-2" />}>
                Verify email
              </Button>
            </Link>
          )}
          {!(user?.isPremium) && (
            <Link to={`/auth/register-premium`}>
              <Button className="mt-4 mr-4 text-green-600" icon={<FaArrowUp className="mr-2" />}>
                Upgrade
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
