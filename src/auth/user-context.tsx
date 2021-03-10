// src/playingNow-context.js
import { navigate } from 'gatsby'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { request } from '../utils/request'

const UserContext = React.createContext({})

// const spotifyOriginal = new Spotify()

type User = {
  username: string
}

export function UserProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    request('GET', '/getUser')
      .then((user) => {
        setUser(user)
      })
      .catch(() => {
        console.log('Not authed')
      })
      .finally(() => {
        setLoadingUser(false)
      })
  }, [])

  const logoutUser = () => {
    request('GET', '/logout').then(() => {
      navigate('/')
      setUser(null)
    })
  }

  return <UserContext.Provider value={{ setUser, user, loadingUser, logoutUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
