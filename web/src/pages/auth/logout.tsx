import React, { useEffect } from 'react'
import { useUser } from '../../auth/user-context'

export default function LogOut() {
  const { logoutUser } = useUser()

  useEffect(() => {
    logoutUser()
  }, [])
  return <div>Logged out</div>
}
