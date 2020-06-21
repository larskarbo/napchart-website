import { AuthProvider } from "./auth_provider";

/**
 * Helpful documentation on how to implement
 * Firebase Auth: https://firebase.google.com/docs/auth/web/start
 */
export class FirebaseAuthProvider implements AuthProvider {
  private isSignedIn: boolean = false;
  constructor() {}

  isUserSignedIn(): boolean {
    return this.isSignedIn;
  }
}

export let firebaseAuthProvider = new FirebaseAuthProvider();
