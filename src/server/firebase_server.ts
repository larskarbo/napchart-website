import { Server } from './server'
import { ServerImpl } from './server_impl'
import * as firebase from 'firebase/app'
import { NapChart } from '../components/Editor/napchart'
require('firebase/firestore')

/*
If user is not signed in, 
*/
export class FirebaseServer implements Server {
  private constructor() {}

  db(): any {
    return firebase.firestore()
  }

  loadChartsForUser(userId: number) {
    return Promise.resolve()
  }
  save(data: NapChart['data'], title: string, description: string) {
    this.db().collection('charts').add({
      data,
    })
    return Promise.resolve(555)
  }
  loadChart(loading: any, loadFinish: any, ab: any) {}
  sendFeedback(feedback: any, cb: any) {}
  addEmailToFeedback(email: any, feedbackId: any, cb: any) {}
}
