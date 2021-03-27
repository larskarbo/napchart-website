import React, { useContext, useRef, useState } from 'react'
import { request } from '../../utils/request'
import { FormElement } from './FormElement'
import LoginLayout from './LoginLayout'
import { SubmitButton } from './SubmitButton'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { useMutation } from 'react-query'
import NotyfContext from '../common/NotyfContext'

export default function ForgotPasswordPage() {
  const formRef = useRef()

  const [submitted, setSubmitted] = useState(false)
  const [msg, setMsg] = useState('')
  const notyf = useContext(NotyfContext)

  const mutation = useMutation(
    (email) => {
      return request('POST', '/forgotPassword', {
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
      onError: (err) => {
        console.log('errorrrrr: ', err)
        notyf.error(getErrorMessage(err))
        const errorMessage = getErrorMessage(err)
        setMsg(errorMessage)
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
