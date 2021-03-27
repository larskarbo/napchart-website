import React, { useEffect, useRef, useState } from 'react'

import { Link, navigate } from 'gatsby'
import { FormElement } from './FormElement'
import { SubmitButton } from './SubmitButton'
import LoginLayout from './LoginLayout'
import { request } from '../../utils/request'
import { useUser } from '../../auth/user-context'

export default function LoginPage({ location }) {
  const { user, setUser } = useUser()
  const formRef = useRef()
  const [msg, setMsg] = useState('')

  const onLogin = (e) => {
    e.preventDefault()

    const email = formRef.current.email.value
    const password = formRef.current.password.value

    request('POST', '/login', {
      email,
      password,
    })
      .then((res) => {
        console.log('res: ', res)
        // tryAgainUser()
        setUser(res)
        console.log('location.state.redirectTo: ', location.state.redirectTo)
        if (location?.state?.redirectTo) {
          navigate(location.state.redirectTo)
        } else {
          navigate('/app')
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message == 'wrong password') {
          setMsg('Wrong username or password, please try again.')
        } else {
          setMsg(error.message)
        }
      })
  }

  return (
    <LoginLayout msg={msg}>
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
