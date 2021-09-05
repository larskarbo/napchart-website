import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useQueryClient } from 'react-query'
import { useUser } from '../../auth/user-context'
import Button from '../../components/common/Button'
import { FormElement } from '../../components/Login/FormElement'
import LoginLayout from '../../components/Login/LoginLayout'
import { SubmitButton } from '../../components/Login/SubmitButton'
import { request } from '../../utils/request'
import { useNCMutation, useNotyf } from '../../utils/requestHooks'

export default function LoginPage({ location }) {
  const { user } = useUser()
  const formRef = useRef()
  const router = useRouter()

  const queryClient = useQueryClient()
  const notyf = useNotyf()

  let justPaid = false
  const searchParams = router.query
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
          router.push(location.state.redirectTo)
        } else {
          router.push('/app')
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
          <Link href="/app">
            <SubmitButton>Go to app</SubmitButton>
          </Link>
          <Link href="/auth/logout">
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
              <Button linkTo="/auth/register-premium" className="my-2">
                Register
              </Button>
            </div>
          )}
          <form ref={formRef} onSubmit={onLogin}>
            <FormElement title={'Email address'} type="email" name="email" placeholder="you@email.com" />

            <FormElement title={'Password'} type="password" name="password" placeholder="*******" />

            <SubmitButton>Log in</SubmitButton>

            <Link href="/auth/forgot-password">
              <a className="text-sm ">Forgot password?</a>
            </Link>
          </form>
        </>
      )}
    </LoginLayout>
  )
}
