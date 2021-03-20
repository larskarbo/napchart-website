import './src/main.2233064c.chunk.css'
import './src/tailwind.css'
import './src/styles.css'
import { UserProvider } from './src/auth/user-context'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider {...props}>{element}</UserProvider>
    </QueryClientProvider>
  )
}
