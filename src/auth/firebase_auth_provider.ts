import { AuthProvider } from './auth_provider'
import * as firebase from 'firebase/app'

/**
 * Helpful documentation on how to implement
 * Firebase Auth: https://firebase.google.com/docs/auth/web/start
 */
export class FirebaseAuthProvider implements AuthProvider {
  private isSignedIn: boolean = false
  constructor() {}

  isUserSignedIn(): boolean {
    return this.isSignedIn
  }

  getCurrentUser(): firebase.User | null {
    return firebase.auth().currentUser
  }

  getUserId(): string | undefined {
    return firebase.auth().currentUser?.uid
  }

  signInAnonymously(): Promise<any> {
    return firebase.auth().signInAnonymously()
  }
}

export let firebaseAuthProvider = new FirebaseAuthProvider()
