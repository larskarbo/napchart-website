// import { FirebaseServer } from '../src/server/FirebaseServer'
const data = require('./initial_data.json')
require('dotenv').config()

var firebase = require('firebase/app')
require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}
const firebaseApp = firebase.initializeApp(firebaseConfig)
// console.log('firebaseConfig: ', firebaseConfig)

const db = firebase.firestore(firebaseApp)
db.settings({
  ssl: false,
  host: 'localhost:8080',
})

const yo = async () => {
  for (const [key, value] of Object.entries(data)) {
    await db
      .collection('charts')
      .doc(key)
      .set(value)
      .then((docRef) => {
        // console.log('added', key)
      })
  }
}

yo()
