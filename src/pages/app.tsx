import { Router } from '@reach/router'
import React, { useEffect, useState } from 'react'
import { useUser } from '../auth/user-context'
import Editor from '../components/Editor/Editor'
import LoginPage from '../components/Login/LoginPage'
import RegisterPage from '../components/Login/RegisterPage'
import SetPasswordPage from '../components/Login/SetPasswordPage'
import Profile from '../components/Profile/Profile'
import DiscourseConnect from '../components/Login/DiscourseConnect'
import ForgotPasswordPage from '../components/Login/ForgotPasswordPage'

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
      <Router>
        <LogOut path="/auth/logout" />
        <LoginRoute component={LoginPage} path="/auth/login" />
        <LoginRoute component={RegisterPage} path="/auth/register" />
        <LoginRoute component={DiscourseConnect} path="/auth/discourse-connect" />
        <LoginRoute component={SetPasswordPage} path="/auth/set-password" />
        <LoginRoute component={ForgotPasswordPage} path="/auth/forgot-password" />
        <Editor path="/app" />
        <Profile path="/user/:username" />
        <Editor path="/:chartid" />
        <Editor path="/snapshot/:chartid" />
        <Editor path="/:username/:titleAndChartid" />
        {/* <Editor path="/user/:username/chart/:titleAndChartid" /> */}
      </Router>
    </>
  )
}
const LoginRoute = ({ component: Component, ...rest }) => {
  // const { isAuthenticated } = useUser()
  // if (isAuthenticated) {
  //   navigate("/app", { replace: true })
  //   return null
  // }
  return <Component {...rest} />
}

const NotFound = () => <div>not found</div>

const LogOut = () => {
  const { logoutUser } = useUser()

  useEffect(() => {
    logoutUser()
  })
  return <div>Logged out</div>
}
