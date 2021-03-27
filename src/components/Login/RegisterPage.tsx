import React, { useEffect, useRef, useState } from 'react'

import { useLocation } from '@reach/router'
import { Link, navigate } from 'gatsby'
import { parse } from 'query-string'
import { request } from '../../utils/request'
import { FormElement } from './FormElement'
import LoginLayout from './LoginLayout'
import { SubmitButton } from './SubmitButton'
import { useUser } from '../../auth/user-context'
import { getErrorMessage } from '../../utils/getErrorMessage'

export default function RegisterPage({}) {
  const formRef = useRef()
  const [loading, setLoading] = useState(true)
  const { setUser } = useUser()

  const [msg, setMsg] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    const code = formRef.current.code.value

    if (code != 'NAPCHART_V11') {
      return alert('Wrong code')
    }
    const email = formRef.current.email.value
    const password = formRef.current.password.value
    const passwordTwo = formRef.current.passwordTwo.value
    const username = formRef.current.username.value

    if (password != passwordTwo) {
      alert("Passwords don't match")
      return
    }

    request('POST', '/register', {
      email,
      password,
      username,
    })
      .then((user) => {
        console.log('user: ', user)
        setUser(user)
        navigate('/user/' + user.username)
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
            title={'Secret Code'}
            type="text"
            name="code"
            // value={searchParams.email}
          />

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
