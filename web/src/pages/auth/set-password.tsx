import Link from 'next/link'
import { useRouter } from 'next/router'
import { parse } from 'query-string'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { request } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import { FormElement } from '../../components/Login/FormElement'
import LoginLayout from '../../components/Login/LoginLayout'
import { SubmitButton } from '../../components/Login/SubmitButton'

export default function SetPasswordPage({ mode }) {
  const formRef = useRef()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState(null)
  const [verifyError, setVerifyError] = useState(false)
  const router = useRouter()

  const searchParams = parse(location.search)
  if (!searchParams.utoken) {
    alert('Link is malformed, double check that you have the right link')
    router.push('/app/login')
  }

  useEffect(() => {
    request('POST', '/verifyPasswordResetToken', {
      utoken: searchParams.utoken,
    })
      .then((res) => {
        console.log('res: ', res)
        setEmail(res.email)
      })
      .catch((err) => {
        setVerifyError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const [msg, setMsg] = useState('')

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
        router.push('/auth/login')
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
              <Link href="/app/forgot-password">
                <span className="underline text-blue-500">request a new link</span>
              </Link>{' '}
            </p>
            <p className="py-3">
              You can also try to{' '}
              <Link href="/app/login">
                <span className="underline text-blue-500">log in</span>
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
