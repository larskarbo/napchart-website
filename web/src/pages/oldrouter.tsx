import React, { useEffect, useState } from 'react'
import { useUser } from '../auth/user-context'
import Editor from '../components/Editor/Editor'
import Profile from './user/[username]'
import Users from './users'

export default function App() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <>
      {/* <LogOut path="/auth/logout" />
      <LoginPage path="/auth/login" />
      <RegisterPage path="/auth/register" />
      <PremiumPage path="/auth/register-premium" />
      <DiscourseConnect path="/auth/discourse-connect" />
      <SetPasswordPage path="/auth/set-password" />
      <ForgotPasswordPage path="/auth/forgot-password" />
      <VerifyEmailPage path="/auth/verify-email" /> */}

      {/* <New path="/new" /> */}
      <Editor path="/app" isApp={true} />
      <Profile path="/user/:username" />
      <Users path="/users" />
      <Editor path="/:oldchartid" />
      <Editor path="/snapshot/:chartid" />
      <Editor path="/:username/:titleAndChartid" />
      {/* <Editor path="/user/:username/chart/:titleAndChartid" /> */}
    </>
  )
}

const NotFound = () => <div>not found</div>

const LogOut = () => {
  const { logoutUser } = useUser()

  useEffect(() => {
    logoutUser()
  }, [])
  return <div>Logged out</div>
}
