import React from 'react'

import '../main.2233064c.chunk.css'

import Editor from '../components/Editor/Editor'

import { FirebaseServer } from '../server/FirebaseServer'
import { firebaseAuthProvider } from '../auth/firebase_auth_provider'
FirebaseServer.init({ authProvider: firebaseAuthProvider })
if (!firebaseAuthProvider.isUserSignedIn) {
  firebaseAuthProvider.signInAnonymously()
}

import { Router } from '@reach/router'

export default class App extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <Router>
        <Editor server={FirebaseServer.getInstance()} path="/app" />
        <EditorWithChartID path="/:chartid" />
      </Router>
    )
  }
}

function EditorWithChartID({ chartid }) {
  // kind of hacky, TODO make it cleaner, get chartid from
  // the actual Editor component

  return <Editor chartid={chartid} server={FirebaseServer.getInstance()} />
}
