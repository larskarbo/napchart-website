import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { FormElement } from '../../components/Login/FormElement'
import LoginLayout from '../../components/Login/LoginLayout'
import { SubmitButton } from '../../components/Login/SubmitButton'
import { request } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'

export default function SetPasswordPage({ mode }) {
  const formRef = useRef()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState(null)
  const [verifyError, setVerifyError] = useState(false)
  const router = useRouter()

  const searchParams = router.query
  console.log('searchParams: ', searchParams)

  useEffect(() => {
    if (router.query?.utoken) {
      request('POST', '/verifyPasswordResetToken', {
        utoken: searchParams.utoken,
      })
        .then((res) => {
          console.log('res: ', res)
          setEmail(res.email)
        })
        .catch((err) => {
          console.log('err: ', err.response.data)
          setVerifyError(true)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [router.query?.utoken])

  const mutation = useNCMutation(
    () => {
      // @ts-ignore
      const email = formRef.current.email.value
      // @ts-ignore
      const password = formRef.current.password.value
      // @ts-ignore
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
            <p className="py-3">We could not verify the link. Maybe the link is malformed.</p>
            <p className="py-3">
              Please{' '}
              <Link href="/app/forgot-password" legacyBehavior>
                <span className="underline text-blue-500">request a new link</span>
              </Link>{' '}
            </p>
            <p className="py-3">
              You can also try to{' '}
              <Link href="/app/login" legacyBehavior>
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
  );
}
