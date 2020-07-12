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
          apiKey: 'AIzaSyDZIH0Vogv07ZWCUMwPn1gaBaF_6rAP_zg',
          authDomain: 'napchart-1abe4.firebaseapp.com',
          databaseURL: 'https://napchart-1abe4.firebaseio.com',
          projectId: 'napchart-1abe4',
          storageBucket: 'napchart-1abe4.appspot.com',
          messagingSenderId: '747326670843',
          appId: '1:747326670843:web:39891acdbdf5df1cd8ed5e',
          measurementId: 'G-NP62410MLV',
        }
        const firebaseApp = firebase.initializeApp(firebaseConfig)
        FirebaseServer.instance.db = firebase.firestore(firebaseApp)
        // If we are testing locally, use the emulator.
        if (window.location.hostname == 'localhost') {
          FirebaseServer.instance.db.settings({
            ssl: false,
            host: 'localhost:8080',
          })
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
          console.log(`${doc.id} => ${doc.data()}`)
        })
      })
    return promise
  }

  save(data: NapChartData, title: string, description: string): Promise<string> {
    if (firebaseAuthProvider.isUserSignedIn()) {
      const userId = firebaseAuthProvider.getUserId()
      if (userId !== undefined) {
        // TODO: Fix this once login is implemented.
        // return this.db
        //   .collection('charts')
        //   .doc(userId)
        //   .set({ data })
        //   .then(() => 'chartid')
      }
    }

    const dataForServer: ChartData = {
      title: title,
      description: description,
      elements: data.elements.map((element) => {
        return {
          start: element.start,
          end: element.end,
          lane: element.lane,
          text: element.text,
          color: element.color,
        }
      }),
      colorTags: data.colorTags,
      shape: data.shape,
      lanes: data.lanes,
      lanesConfig: data.lanesConfig,
    }

    return this.getUniqueChartId().then((chartid) => {
      console.error('generated unique id')
      console.error(chartid)
      return this.db
        .collection('charts')
        .doc(chartid)
        .set(dataForServer)
        .then((docRef) => {
          return chartid
        })
    })
  }

  private generateRandomId(): string {
    const alphabet = 'abcdefghijklmnopqrstuwxyz0123456789'
    let id = ''
    for (var i = 0; i < 5; i++) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return id
  }

  async getUniqueChartId(): Promise<string> {
    let id = this.generateRandomId()
    while (await this.isIdAlreadyTaken(id)) {
      id = this.generateRandomId()
    }
    return id
  }

  private isIdAlreadyTaken(id: string): Promise<boolean> {
    return FirebaseServer.instance.db
      .collection('charts')
      .doc(id)
      .get()
      .then((doc) => {
        return doc.exists
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
        console.log('result hur')
        console.log(result)
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
