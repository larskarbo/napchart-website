import React, { useEffect, useRef, useState } from 'react'

import { Link, navigate } from 'gatsby'
import { useLocation } from '@reach/router'
import { parse } from 'query-string'
import LoginLayout from './LoginLayout'
import { FormElement } from './FormElement'
import { SubmitButton } from './SubmitButton'
import { useUser } from '../../auth/user-context'
import { request } from '../../utils/request'

export enum regType {
  LOGIN = 'login',
  SET_PASSWORD = 'set-password',
}

export default function SetPasswordPage({ mode }) {
  const { tryAgainUser } = useUser()
  const formRef = useRef()
  const [loading, setLoading] = useState(true)
  const [verifyError, setVerifyError] = useState(false)

  const location = useLocation()
  const searchParams = parse(location.search)
  if (!searchParams.email || !searchParams.token) {
    alert('Link is malformed, double check that you have the right link')
  }

  useEffect(() => {
    request('POST', '/verifyToken', {
      email: searchParams.email,
      token: searchParams.token,
    })
      .then((res) => {
        // tryAgainUser()
        // navigate("/french/pronunciation-course");
      })
      .catch((err) => {
        setVerifyError(true)
        Sentry.captureException(new Error('verify token error'), {
          extra: {
            searchParams,
            response: err?.response,
          },
        })
        // tryAgainUser()
        // navigate("/french/pronunciation-course");
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const [msg, setMsg] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    const email = formRef.current.email.value
    const password = formRef.current.password.value
    const passwordTwo = formRef.current.passwordTwo.value
    const token = formRef.current.token.value

    if (password != passwordTwo) {
      alert("Passwords don't match")
      return
    }

    if (password.length < 6) {
      alert('Choose a password with at least 6 letters')
      return
    }

    console.log('email: ', email)
    request('POST', '/setPassword', {
      email,
      password,
      token,
    })
      .then((user) => {
        tryAgainUser()
        navigate('/french/pronunciation-course')
      })
      .catch(async (asdf) => {
        // Sentry.captureException(new Error("wrong token"), {
        //   extra: {
        //     section: "articles",
        //     token,
        //     passwordTwo,
        //     password,
        //     email,
        //     response: asdf?.response,
        //   },
        // });
        const response = await asdf?.response?.json?.()
        if (response?.message == 'email not found') {
          alert('Email not found in database...')
          return
        }
        if (response?.message == 'wrong token') {
          alert('The token is wrong or outdated...')
          return
        }

        alert('Some error...')
      })
    // signupUser(email, password)
    //   .catch((err) => setMsg("Error: " + err.message));
  }

  return (
    <LoginLayout>
      {loading ? (
        <>Loading...</>
      ) : verifyError ? (
        <>
          <div>
            <p className="py-3">
              We couldn't verify the link. Maybe you already created a password? Or maybe the link is malformed.
            </p>
            <p className="py-3">
              Please{' '}
              <a className="underline text-blue-500" href="mailto:imitate@larskarbo.no">
                contact me
              </a>{' '}
              if you need assistance.
            </p>
            <p className="py-3">
              You can also try to{' '}
              <Link className="underline text-blue-500" to="/app/login">
                log in
              </Link>
              .
            </p>
          </div>
        </>
      ) : (
        <>
          <form ref={formRef} onSubmit={onSubmit}>
            <div className="font-medium mb-4">Setting password</div>
            <input type="hidden" name={'token'} value={searchParams.token} />

            <FormElement
              title={'Email address'}
              type="email"
              name="email"
              placeholder="you@email.com"
              value={searchParams.email}
              disabled
            />

            <FormElement
              title={'Password'}
              type="password"
              name="password"
              placeholder="*******"
              // value={searchParams.email}
            />

            <FormElement
              title={'Confirm password'}
              type="password"
              name="passwordTwo"
              placeholder="*******"
              // value={searchParams.email}
            />

            <SubmitButton>Set password and log in</SubmitButton>
          </form>
        </>
      )}
    </LoginLayout>
  )
}
