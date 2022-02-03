import PlausibleProvider from 'next-plausible'
import Head from 'next/head'
import React from 'react'
import '../tailwind.css'
import '../styles.css'
import 'notyf/notyf.min.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { UserProvider } from '../auth/user-context'
import { ModalProvider } from '../components/common/ModalContext'
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <UserProvider>
            <PlausibleProvider domain="napchart.com">
              <Head>
                <meta property="og:site_name" content="Napchart" />
              </Head>

              <div suppressHydrationWarning>{typeof window === 'undefined' ? null : <Component {...pageProps} />}</div>
            </PlausibleProvider>
          </UserProvider>
        </ModalProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
