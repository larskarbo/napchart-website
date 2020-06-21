export interface AuthProvider {
  isUserSignedIn: () => boolean;
  getUserId: () => string | undefined;
}
