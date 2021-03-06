import { Router } from '@reach/router'
import React, { useEffect, useState } from 'react'
import { firebaseAuthProvider } from '../auth/firebase_auth_provider'
import { useUser } from '../auth/user-context'
import Editor from '../components/Editor/Editor'
import LoginPage from '../components/Login/LoginPage'
import RegisterPage from '../components/Login/RegisterPage'
import SetPasswordPage from '../components/Login/SetPasswordPage'
import Profile from '../components/Profile/Profile'
import { FirebaseServer } from '../server/FirebaseServer'

FirebaseServer.init({ authProvider: firebaseAuthProvider })
if (!firebaseAuthProvider.isUserSignedIn) {
  firebaseAuthProvider.signInAnonymously()
}

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
        <LogOut path="/logout" />
        <LoginRoute component={LoginPage} path="/login" />
        <LoginRoute component={RegisterPage} path="/register" />
        <LoginRoute component={SetPasswordPage} path="/set-password" />
        <Editor server={FirebaseServer.getInstance()} path="/app" />
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

  return <Editor chartid={chartid} server={FirebaseServer.getInstance()} />
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
