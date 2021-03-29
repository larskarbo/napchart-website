import { useLocation } from '@reach/router'
import { Link, navigate } from 'gatsby'
import { parse } from 'query-string'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { request } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import NotyfContext from '../common/NotyfContext'
import { FormElement } from './FormElement'
import LoginLayout from './LoginLayout'
import { SubmitButton } from './SubmitButton'

export default function SetPasswordPage({ mode }) {
  const formRef = useRef()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState(null)
  const [verifyError, setVerifyError] = useState(false)

  const location = useLocation()
  const searchParams = parse(location.search)
  if (!searchParams.utoken) {
    alert('Link is malformed, double check that you have the right link')
    navigate('/app/login')
  }

  useEffect(() => {
    request('POST', '/verifyPasswordResetToken', {
      utoken: searchParams.utoken,
    })
      .then((res) => {
        console.log('res: ', res)
        setEmail(res.email)
        // navigate("/french/pronunciation-course");
      })
      .catch((err) => {
        setVerifyError(true)
        // navigate("/french/pronunciation-course");
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const [msg, setMsg] = useState('')

  const notyf = useContext(NotyfContext)

  const mutation = useNCMutation(
    () => {
      const email = formRef.current.email.value
      const password = formRef.current.password.value
      const passwordTwo = formRef.current.passwordTwo.value
      const utoken = formRef.current.utoken.value
      return request('POST', '/setPassword', {
        email,
        password,
        token: utoken,
      })
    },
    {
      onSuccess: (res) => {
        navigate('/auth/login')
      },
    },
  )

  const onSubmit = (e) => {
    e.preventDefault()

    mutation.mutate()
  }

  return (
    <LoginLayout msg={mutation.errorMessage}>
      {loading ? (
        <>Loading...</>
      ) : verifyError ? (
        <>
          <div>
            <p className="py-3">We couldn't verify the link. Maybe the link is malformed.</p>
            <p className="py-3">
              Please{' '}
              <Link to="/app/forgot-password" className="underline text-blue-500">
                request a new link
              </Link>{' '}
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
            <input type="hidden" name={'utoken'} value={searchParams.utoken} />

            <FormElement
              title={'Email address'}
              type="email"
              name="email"
              placeholder="you@email.com"
              value={email}
              disabled
            />

            <FormElement
              title={'New Password'}
              autoComplete={'new-password'}
              type="password"
              name="password"
              placeholder="*******"
              // value={searchParams.email}
            />

            <FormElement
              title={'Confirm password'}
              autoComplete={'new-password'}
              type="password"
              name="passwordTwo"
              placeholder="*******"
              // value={searchParams.email}
            />

            <SubmitButton>Set password</SubmitButton>
          </form>
        </>
      )}
    </LoginLayout>
  )
}
