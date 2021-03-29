import { Link } from 'gatsby'
import { parse } from 'query-string'
import React, { useEffect, useState } from 'react'
import { FaLock } from 'react-icons/fa'
import { useQueryClient } from 'react-query'
import { useUser } from '../../auth/user-context'
import { request } from '../../utils/request'
import { useNCMutation, useNotyf } from '../../utils/requestHooks'
import Button from '../common/Button'
import LoginLayout from './LoginLayout'

export default function VerifyEmailPage({}) {
  const { user } = useUser()

  const searchParams = parse(location.search)

  const [utoken, setToken] = useState(searchParams.utoken)

  const notyf = useNotyf()
  const queryClient = useQueryClient()

  const [msg, setMsg] = useState('')

  const verifyToken = useNCMutation(
    () =>
      request('POST', `/verifyEmail`, {
        utoken: utoken,
      }),
    {
      onSuccess: (res) => {
        console.log('res: ', res)
        queryClient.invalidateQueries('user')
        notyf.success('Verified email!')
      },
      onSettled: () => {
        setToken(null)
      },
    },
  )

  const requestLink = useNCMutation(() => request('POST', `/sendEmailVerifyToken`), {
    onSuccess: (res) => {
      const { chartDocument } = res
      console.log('res: ', res)

      setTimeout(() => {
        requestLink.reset()
      }, 30000)
    },
  })

  useEffect(() => {
    if (utoken) {
      verifyToken.mutate()
    }
  }, [utoken])

  if (utoken) {
    return <LoginLayout msg={msg}>Verifying token</LoginLayout>
  }

  return (
    <LoginLayout msg={msg}>
      {user ? (
        user.email_verified ? (
          <>
            <div>Awesome! Your email is verified!</div>
            <Link to="/app">
              <Button>Go to app</Button>
            </Link>
            <Link to={`/user/${user.username}`}>
              <Button>Go to profile</Button>
            </Link>
          </>
        ) : (
          <>
            <div className="my-4">Your email is not verified.</div>
            {requestLink.isSuccess ? (
              <div className="my-4">Email verification link sent.</div>
            ) : (
              <Button loading={requestLink.isLoading} onClick={requestLink.mutate}>
                Request new verification link.
              </Button>
            )}
          </>
        )
      ) : (
        <>
          <div>You are not logged in.</div>
          <Link to="/auth/login">
            <Button icon={<FaLock />}>Log in here</Button>
          </Link>
        </>
      )}
    </LoginLayout>
  )
}
