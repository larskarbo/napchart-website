import { getErrorMessage } from 'get-error-message'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import { FormElement } from '../../components/Login/FormElement'
import LoginLayout from '../../components/Login/LoginLayout'
import { SubmitButton } from '../../components/Login/SubmitButton'
import { request } from '../../utils/request'

export default function RegisterPage({}) {
  const formRef = useRef()
  const router = useRouter()

  const queryClient = useQueryClient()

  const searchParams = router.query
  useEffect(() => {
    if (!searchParams.session_id) {
      router.replace('/auth/register-premium')
    }
  }, [searchParams])

  const [msg, setMsg] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    // @ts-ignore
    const email = formRef.current.email.value
    // @ts-ignore
    const password = formRef.current.password.value
    // @ts-ignore
    const passwordTwo = formRef.current.passwordTwo.value
    // @ts-ignore
    const username = formRef.current.username.value

    if (password != passwordTwo) {
      alert("Passwords don't match")
      return
    }

    request('POST', '/register', {
      email,
      password,
      username,
      session_id: searchParams.session_id,
    })
      .then((user) => {
        queryClient.invalidateQueries('user')

        router.push('/user/' + user.username)
        // window.location.href =
      })
      .catch(async (asdf) => {
        // console.log('asdf: ', );
        setMsg(getErrorMessage(asdf))

        console.log('asdf: ', asdf.response)
      })
  }

  return (
    <LoginLayout msg={msg}>
      <>
        <form ref={formRef} onSubmit={onSubmit}>
          <FormElement
            title={'Username'}
            type="text"
            name="username"
            // value={searchParams.email}
          />

          <FormElement
            title={'Email address'}
            type="email"
            name="email"
            placeholder="you@email.com"
            // value={searchParams.email}
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

          <SubmitButton>Register</SubmitButton>
        </form>
      </>
    </LoginLayout>
  )
}
