/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

import Router from './components/Router.jsx'

render(
  <Router pathname={location.pathname} />,
  document.getElementById('root')
)
