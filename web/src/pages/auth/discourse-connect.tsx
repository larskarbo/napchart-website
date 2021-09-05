import { useRouter } from 'next/router'
import { parse } from 'query-string'
import React, { useRef, useState } from 'react'
import { useUser } from '../../auth/user-context'
import LoginLayout from '../../components/Login/LoginLayout'
import { SubmitButton } from '../../components/Login/SubmitButton'
import { request } from '../../utils/request'

export default function DiscourseConnect({}) {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const { user, loadingUser } = useUser()
  const router = useRouter()

  console.log('{ user, loadingUser }: ', { user, loadingUser })

  const searchParams = parse(location.search)

  const [msg, setMsg] = useState('')

  if (!searchParams.sso || !searchParams.sig) {
    return <div>'Link is malformed, double check that you have the right link'</div>
  }
  const onLogin = (e) => {
    e.preventDefault()

    setLoading(true)
    request('GET', `/discourse-connect${location.search}`)
      .then((res) => {
        console.log('res: ', res)
        if (res.success) {
          location.replace(res.redirectUrl)
        }
      })
      .catch((error) => {
        // if (error?.response?.data?.message == 'wrong password') {
        //   setMsg('Wrong username or password, please try again.')
        // } else {
        // }
        setLoading(false)
        setMsg(error.message)
      })
  }

  if (!user && !loadingUser) {
    alert('state')
    router.push('/auth/login', {
      // state: { redirectTo: location.href, replace: true },
    })
  }

  return (
    <LoginLayout msg={msg}>
      {user ? (
        <>
          <form onSubmit={onLogin}>
            <div className="my-4">
              You are logged in as <strong>{user?.username}</strong>.
            </div>
            <div className="my-4">
              Do you want to login to <strong>Napchart Community</strong>?
            </div>
            {loading ? <SubmitButton disabled>...</SubmitButton> : <SubmitButton>Log in</SubmitButton>}
          </form>
        </>
      ) : (
        <>You are not logged in.</>
      )}
    </LoginLayout>
  )
}
