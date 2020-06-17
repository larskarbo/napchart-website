import { Server } from './server'
import { ServerImpl } from './server_impl'
import * as firebase from 'firebase/app'
import { NapChart } from '../components/Editor/napchart'
require('firebase/firestore')

/*
If user is not signed in, 
*/
export class FirebaseServer implements Server {
  db(): any {
    return firebase.firestore()
  }

  loadChartsForUser(userId: number) {
    const promise = this.db()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`)
        })
      })
    return promise
  }
  save(data: NapChart['data'], title: string, description: string) {
    return this.db().collection('charts').add({
      data,
    })
    // then() returns docRef
    // error() returns err
  }
  loadChart(loading: any, loadFinish: any, ab: any) {}
  sendFeedback(feedback: any, cb: any) {}
  addEmailToFeedback(email: any, feedbackId: any, cb: any) {}
}
