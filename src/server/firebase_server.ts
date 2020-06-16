import { Server } from './server'
import { ServerImpl } from './server_impl'
import * as firebase from 'firebase/app'
require('firebase/firestore')

/*
If user is not signed in, 
*/
export class FirebaseServer implements Server {
  private static instance: Server
  private constructor() {}

  db(): any {
    return firebase.firestore()
  }

  loadChartsForUser(userId: number) {
    return Promise.resolve()
  }
  save(data: any, title: string, description: string, db: any) {}
  loadChart(loading: any, loadFinish: any, ab: any) {}
  sendFeedback(feedback: any, cb: any) {}
  addEmailToFeedback(email: any, feedbackId: any, cb: any) {}
}
