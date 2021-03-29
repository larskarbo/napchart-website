import React, { useEffect, useRef, useState } from 'react'

import { Link, navigate } from 'gatsby'
import { FormElement } from './FormElement'
import { SubmitButton } from './SubmitButton'
import LoginLayout from './LoginLayout'
import { request } from '../../utils/request'
import { useUser } from '../../auth/user-context'
import { useQueryClient } from 'react-query'
import { useNCMutation, useNotyf } from '../../utils/requestHooks'

export default function LoginPage({ location }) {
  const { user } = useUser()
  const formRef = useRef()
  const [msg, setMsg] = useState('')
  const queryClient = useQueryClient()
  const notyf = useNotyf()

  const email = formRef?.current?.email.value
  const password = formRef?.current?.password.value

  const login = useNCMutation(
    () =>
      request('POST', '/login', {
        email,
        password,
      }),
    {
      onSuccess: async (res) => {
        await queryClient.fetchQuery('user')

        if (location?.state?.redirectTo) {
          navigate(location.state.redirectTo)
        } else {
          navigate('/app')
        }
        notyf.success('Logged in!')
      },
    },
  )

  const onLogin = (e) => {
    e.preventDefault()
    login.mutate()
  }

  return (
    <LoginLayout msg={login.errorMessage}>
      {user ? (
        <>
          <div className="my-4">You are already logged in!</div>
          <Link to="/app">
            <SubmitButton>Go to app</SubmitButton>
          </Link>
          <Link to="/auth/logout">
            <SubmitButton>Log out</SubmitButton>
          </Link>
        </>
      ) : (
        <>
          <div className="pb-4 text-xs text-gray-700 font-light">
            Napchart accounts are currently only available for a limited amount of users.
          </div>
          <form ref={formRef} onSubmit={onLogin}>
            <FormElement title={'Email address'} type="email" name="email" placeholder="you@email.com" />

            <FormElement title={'Password'} type="password" name="password" placeholder="*******" />

            <SubmitButton>Log in</SubmitButton>

            <Link to="/auth/forgot-password" className="text-sm ">
              Forgot password?
            </Link>
          </form>
        </>
      )}
    </LoginLayout>
  )
}
