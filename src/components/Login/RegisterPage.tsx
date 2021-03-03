import React, { useEffect, useRef, useState } from 'react'

import { useLocation } from '@reach/router'
import { Link, navigate } from 'gatsby'
import { parse } from 'query-string'
import { request } from '../../utils/request'
import { FormElement } from './FormElement'
import LoginLayout from './LoginLayout'
import { SubmitButton } from './SubmitButton'

export default function RegisterPage({}) {
  const formRef = useRef()
  const [loading, setLoading] = useState(true)

  const [msg, setMsg] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

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
        // tryAgainUser()
        // navigate('/french/pronunciation-course')
      })
      .catch(async (asdf) => {
        // console.log('asdf: ', );
        if (asdf?.response?.data?.error) {
          setMsg(asdf?.response?.data?.error)
          return
        }
        // if (response?.message == 'email not found') {
        //   alert('Email not found in database...')
        //   return
        // }
        // if (response?.message == 'wrong token') {
        //   alert('The token is wrong or outdated...')
        //   return
        // }

        alert('Some error...')
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
