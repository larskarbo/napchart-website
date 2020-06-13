/*
    ./client/index.js
    which is the webpack entry file
*/

import React from 'react'
import { render } from 'react-dom'

import Router from './components/App'
import * as firebase from 'firebase/app'
const firebaseConfig = {
  apiKey: 'AIzaSyDZIH0Vogv07ZWCUMwPn1gaBaF_6rAP_zg',
  authDomain: 'napchart-1abe4.firebaseapp.com',
  databaseURL: 'https://napchart-1abe4.firebaseio.com',
  projectId: 'napchart-1abe4',
  storageBucket: 'napchart-1abe4.appspot.com',
  messagingSenderId: '747326670843',
  appId: '1:747326670843:web:39891acdbdf5df1cd8ed5e',
  measurementId: 'G-NP62410MLV',
}
firebase.initializeApp(firebaseConfig)
render(<Router />, document.getElementById('root'))
