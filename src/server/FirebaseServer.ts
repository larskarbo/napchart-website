import { Server } from './Server'
import { DocumentData, DocumentReference } from '@firebase/firestore-types'
import * as firebase from 'firebase/app'
import { NapChart } from '../components/Editor/napchart'
import App from '../components/Editor/Editor'
import { FireObject } from '@testing-library/react'
import { FirebaseFirestore, QuerySnapshot } from '@firebase/firestore-types'
import { NapChartData } from '../components/Editor/napchart'
import { AuthProvider } from '../auth/auth_provider'
import { firebaseAuthProvider } from '../auth/firebase_auth_provider'
import { ChartData } from './ChartData'

require('firebase/firestore')
require('firebase/functions')

/*
This class contains all functionality for interacting
with Firebase Firestore.
*/
export interface FirebaseServerProps {
  testApp?: App | any
  authProvider: AuthProvider
}
export class FirebaseServer implements Server {
  private static instance: FirebaseServer
  private db!: FirebaseFirestore
  private functions!: any

  static getInstance(): Server {
    if (!FirebaseServer.instance) {
      console.error('Fatal error. Firebase app not initialized.')
    }
    return FirebaseServer.instance
  }

  static init(props: FirebaseServerProps) {
    if (!FirebaseServer.instance) {
      // If this is not a unit test, initialize Firebase normally.
      FirebaseServer.instance = new FirebaseServer()
      if (props.testApp == undefined || props.testApp == null) {
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
        FirebaseServer.instance.db = firebase.firestore(firebaseApp)
        FirebaseServer.instance.functions = firebase.functions(firebaseApp)
        // If we are testing locally, use the emulator.
        if (window.location.hostname == 'localhost') {
          FirebaseServer.instance.db.settings({
            ssl: false,
            host: 'localhost:8080',
          })
          FirebaseServer.instance.functions.useFunctionsEmulator('http://localhost:5001')
        }
      } else {
        FirebaseServer.instance.db = firebase.firestore(props.testApp)
      }
    } else {
      console.error('FATAL ERROR: You should only call init() once, because this is a singleton.')
    }
  }

  // TODO: Implement this after login works.
  loadChartsForUser(userId: number) {
    const promise = this.db
      .collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(`${doc.id} => ${doc.data()}`)
        })
      })
    return promise
  }

  update(data: NapChartData, chartid: string): Promise<string> {
    const update = this.functions.httpsCallable('updateChart')
    return update({ chartid, data }).then(function () {
      return true
    })
  }

  saveNew(data: NapChartData): Promise<string> {
    const saveNew = this.functions.httpsCallable('saveNewChart')
    return saveNew({ data }).then(function (result) {
      // console.log('result: ', result)
      return result.data.chartid
    })
  }

  loadChart(chartid: string): Promise<ChartData> {
    return this.db
      .collection('charts')
      .doc(chartid)
      .get()
      .then((snapshot) => {
        const result: ChartData = snapshot.data() as ChartData
        if (result === undefined) {
          return Promise.reject('Chart with ID ' + chartid + ' not found.')
        }
        // console.log('result hur')
        // console.log(result)
        // const chartData: ChartData = new ChartData(chartid, result.title, result.description, result.data)
        return Promise.resolve(result)
      })
  }

  sendFeedback(feedback: string): Promise<DocumentReference<DocumentData>> {
    if (feedback.length == 0) {
      return Promise.reject('Feedback is empty.')
    }
    return this.db
      .collection('feedback')
      .add({
        feedback,
      })
      .then((ref) => ref)
  }

  addEmailToFeedback(email: string, feedbackDocRef: DocumentReference<DocumentData>): Promise<any> {
    return feedbackDocRef.get().then((snapshot) => {
      const result: any = snapshot.data()
      if (result === undefined) {
        return Promise.reject('Feedback document not found.')
      }
      result.email = email
      return feedbackDocRef.set(result)
    })
  }

  static testOnlyMethods = {
    // These methods are for unit tests only.
    // Not to be used anywhere in the app.s
    getDb(): FirebaseFirestore {
      return FirebaseServer.instance.db
    },
    resetState() {
      FirebaseServer.instance = undefined as any
      // firebase.clearFirestoreData({ projectId: "napchart-labe4" });
    },
  }
}
