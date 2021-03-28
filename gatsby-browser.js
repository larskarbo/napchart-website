import './src/tailwind.css'
import './src/styles.css'
import 'notyf/notyf.min.css'
import { UserProvider } from './src/auth/user-context'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ModalProvider } from './src/components/common/ModalContext'

const queryClient = new QueryClient()

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <UserProvider {...props}>{element}</UserProvider>
      </ModalProvider>
    </QueryClientProvider>
  )
}
