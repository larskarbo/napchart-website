/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

import Router from './components/App'

render(<Router />, document.getElementById('root'))
