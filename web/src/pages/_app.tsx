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

function MyApp({ Component, pageProps, config }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <UserProvider>
            <PlausibleProvider domain="napchart.com">
              <Head>
                <meta property="og:site_name" content="Napchart" />
              </Head>

              <Component {...pageProps} config={config} />
            </PlausibleProvider>
          </UserProvider>
        </ModalProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
