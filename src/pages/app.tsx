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
import { navigate } from 'gatsby-link';
import VerifyEmailPage from '../components/Login/VerifyEmailPage';
import { PremiumPage } from '../components/Login/PremiumPage';
import OnlyChart from '../components/Editor/OnlyChart';

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
        <LoginPage path="/auth/login" />
        <RegisterPage path="/auth/register" />
        <PremiumPage path="/auth/register-premium" />
        <DiscourseConnect path="/auth/discourse-connect" />
        <SetPasswordPage path="/auth/set-password" />
        <ForgotPasswordPage path="/auth/forgot-password" />
        <VerifyEmailPage path="/auth/verify-email" />


        <New path="/new" />
        <Editor path="/app" isApp={true} />
        <Profile path="/user/:username" />
        <Editor path="/:oldchartid" />
        <Editor path="/snapshot/:chartid" />
        <Editor path="/:username/:titleAndChartid" />
        <OnlyChart path="/only-the-chart/:chartid" />
        {/* <Editor path="/user/:username/chart/:titleAndChartid" /> */}
      </Router>
    </>
  )
}

const NotFound = () => <div>not found</div>

const New = () => {

  useEffect(() => {
    navigate("/app", {replace:true})
  },[])
  return <div>Making new</div>
}

const LogOut = () => {
  const { logoutUser } = useUser()

  useEffect(() => {
    logoutUser()
  },[])
  return <div>Logged out</div>
}
