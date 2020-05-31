/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

import App from './components/App'

render(
  <App />,
  document.getElementById('root')
)
