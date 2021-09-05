// src/playingNow-context.js
import * as React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { PublicUserObject } from '../../../server/utils/publicUserObject'
import { request } from '../utils/request'
import { useRouter } from 'next/router'

const UserContext = React.createContext({})

// const spotifyOriginal = new Spotify()

export function UserProvider({ children }) {
  const router = useRouter()

  const queryClient = useQueryClient()
  const { isLoading: loadingUser, data: user } = useQuery('user', () => request('GET', '/getUser'), {
    onError: (err) => {},
    retry: false,
  })

  const logoutUser = () => {
    request('GET', '/logout').then(() => {
      router.push('/')
      queryClient.resetQueries('user')
    })
  }

  return <UserContext.Provider value={{ user, loadingUser, logoutUser }}>{children}</UserContext.Provider>
}

export function useUser(): { user?: PublicUserObject, loadingUser: boolean, logoutUser: () => void } {
  const context: any = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
