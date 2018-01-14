/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

// import { fetchChartIfNeeded } from './actions/actions.js'

import App from './components/App.jsx'

// store.dispatch(fetchChartIfNeeded())

render(
    <App />,
  document.getElementById('root')
)
