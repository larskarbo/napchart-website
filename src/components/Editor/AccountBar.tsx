import React from 'react'
import { Link } from 'gatsby'
import { useUser } from '../../auth/user-context'
import { CgProfile } from 'react-icons/cg'
import Button from '../common/Button'

export const AccountBar = () => {
  const { user } = useUser()

  return (
    <Link to={user ? `/user/${user.username}` : '/auth/login'}>
      {user ? (
        <Button className="mt-4 mr-4" icon={<CgProfile className="mr-2" />}>
          My profile
        </Button>
      ) : (
        <Button className="mt-4 mr-4" icon={<CgProfile className="mr-2" />}>
          Log in
        </Button>
      )}
    </Link>
  )
}
