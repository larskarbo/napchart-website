import React, { useContext, useRef, useState } from 'react'
import { request } from '../../utils/request'
import { useNCMutation } from '../../utils/requestHooks'
import NotyfContext from '../common/NotyfContext'
import { FormElement } from './FormElement'
import LoginLayout from './LoginLayout'
import { SubmitButton } from './SubmitButton'

export default function ForgotPasswordPage() {
  const formRef = useRef()

  const [submitted, setSubmitted] = useState(false)
  const [msg, setMsg] = useState('')
  const notyf = useContext(NotyfContext)

  const mutation = useNCMutation(
    (email) => {
      return request('POST', '/sendPasswordResetToken', {
        email,
      })
    },
    {
      onSuccess: (res) => {
        console.log('res: ', res)
        setSubmitted(true)

        setTimeout(() => {
          mutation.reset()
        }, 10000)
      },
    },
  )

  const onSubmit = (e) => {
    e.preventDefault()

    const email = formRef.current.email.value

    mutation.mutate(email)
  }

  return (
    <LoginLayout msg={msg}>
      {submitted ? (
        <div className="font-medium mb-4">Check your email for instructions on how to reset the password!</div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="font-medium mb-4">Forgot your password?</div>

          <FormElement title={'Email address'} type="email" name="email" placeholder="you@email.com" value={''} />

          <SubmitButton>{mutation.isLoading ? 'Loading' : 'Reset password'}</SubmitButton>
        </form>
      )}
    </LoginLayout>
  )
}
