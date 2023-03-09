import PlausibleProvider from 'next-plausible'
import Head from 'next/head'
import React, { ReactNode } from 'react'
import '../tailwind.css'
import '../styles.css'
import 'notyf/notyf.min.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { UserProvider } from '../auth/user-context'
import { ModalProvider } from '../components/common/ModalContext'
const queryClient = new QueryClient()
declare module 'react-query/types/react/QueryClientProvider' {
  interface QueryClientProviderProps {
    children?: ReactNode
  }
}

import { useEffect, useState } from 'react'

// this is a hook we can use to avoid hydration issues
// good post: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

function MyApp({ Component, pageProps }) {
  const hasMounted = useHasMounted()
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <UserProvider>
            <PlausibleProvider domain="napchart.com">
              <Head>
                <meta property="og:site_name" content="Napchart" />
              </Head>

              <div>{hasMounted ? <Component {...pageProps} /> : null}</div>
            </PlausibleProvider>
          </UserProvider>
        </ModalProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
