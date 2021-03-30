// src/playingNow-context.js
import { navigate } from 'gatsby'
import * as React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { request } from '../utils/request'

const UserContext = React.createContext({})

// const spotifyOriginal = new Spotify()

export function UserProvider({ children }) {
  const queryClient = useQueryClient()
  const { isLoading: loadingUser, data: user } = useQuery('user', () => request('GET', '/getUser'),{
    onError: (err) => {
    },
    retry:false
  })

  const logoutUser = () => {
    request('GET', '/logout').then(() => {
      navigate('/')
      queryClient.resetQueries('user')
    })
  }

  return <UserContext.Provider value={{ user, loadingUser, logoutUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
