/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

import App from './pages/app'
render(<App />, document.getElementById('root'))
