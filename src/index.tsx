/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

import App from './components/App'
import { FirebaseServer } from './server/FirebaseServer'
import { firebaseAuthProvider } from './auth/firebase_auth_provider'
FirebaseServer.init({ authProvider: firebaseAuthProvider })
render(<App />, document.getElementById('root'))
