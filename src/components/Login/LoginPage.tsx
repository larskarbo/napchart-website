import React, { useEffect, useRef, useState } from 'react'

import { Link, navigate } from 'gatsby'
import { FormElement } from './FormElement'
import { SubmitButton } from './SubmitButton'
import LoginLayout from './LoginLayout'
import { request } from '../../utils/request'
import { useUser } from '../../auth/user-context'
import { useQueryClient } from 'react-query'
import { useNCMutation, useNotyf } from '../../utils/requestHooks'
import { parse } from 'query-string'
import Button from '../common/Button'

export default function LoginPage({ location }) {
  const { user } = useUser()
  const formRef = useRef()
  const [msg, setMsg] = useState('')
  const queryClient = useQueryClient()
  const notyf = useNotyf()

  let justPaid = false
  const searchParams = parse(location.search)
  if (searchParams.session_id) {
    justPaid = true
  }

  const login = useNCMutation(
    () => {
      const email = formRef?.current?.email.value
      const password = formRef?.current?.password.value
      return request('POST', '/login', {
        email,
        password,
      })
    },
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
      {justPaid && (
        <div className="pb-4 text-gray-700 font-light">
          <div className="my-2 font-bold text-green-500">Payment successful!</div>
          <div className="my-2 text-sm ">
            Now you'll need to login with your credentials and verify your email. Let me know if anything is not working
            as expected.
          </div>
        </div>
      )}
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
          {justPaid ? (
            <div></div>
          ) : (
            <div className="pb-4 text-xs text-gray-700 font-light">
              Don't you have an account?

              <Button linkTo="/auth/register-premium" className="my-2">Register</Button>
            </div>
          )}
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
