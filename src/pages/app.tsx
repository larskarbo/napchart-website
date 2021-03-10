import { Router } from '@reach/router'
import React, { useEffect, useState } from 'react'
import { useUser } from '../auth/user-context'
import Editor from '../components/Editor/Editor'
import LoginPage from '../components/Login/LoginPage'
import RegisterPage from '../components/Login/RegisterPage'
import SetPasswordPage from '../components/Login/SetPasswordPage'
import Profile from '../components/Profile/Profile'
import DiscourseConnect from '../components/Login/DiscourseConnect'

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
        <Editor path="/app" />
        <EditorOrProfile path="/:param" />
      </Router>
    </>
  )
}

function EditorOrProfile({ param }: { param: string }) {
  if (param.slice(0, 1) == '@') {
    return <Profile username={param.slice(1)} />
  }

  return <EditorWithChartID chartid={param} />
}

function EditorWithChartID({ chartid }) {
  // kind of hacky, TODO make it cleaner, get chartid from
  // the actual Editor component

  return <Editor chartid={chartid} />
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
