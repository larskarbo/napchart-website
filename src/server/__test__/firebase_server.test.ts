import * as firebase from "@firebase/testing";
import { FirebaseServer } from "../firebase_server";
import { Server } from "../server";
import { assert } from "console";
import { FirebaseFirestore } from "@firebase/firestore-types";
import {
  firebaseAuthProvider,
  FirebaseAuthProvider,
} from "../../auth/firebase_auth_provider";
import { AuthProvider } from "../../auth/auth_provider";
import { napChartMock } from "../../components/Editor/__mocks__/napchart.mock";

var server: Server;
const mockAuthProvider: AuthProvider = {
  isUserSignedIn: () => false,
  getUserId: () => undefined,
};
beforeEach(() => {
  const testApp: any = firebase.initializeTestApp({
    projectId: "napchart-1abe4",
    auth: { uid: "juanitotaveras", email: "alice@example.com" },
  });
  if (firebase == null) {
    assert(false);
  }
  FirebaseServer.init({ testApp: testApp, authProvider: mockAuthProvider });
  server = FirebaseServer.getInstance();
});

afterEach(() => {
  FirebaseServer.resetState();
});

test("does not crash.", async () => {});

test("Saves schedule", async () => {
  server
    .save(napChartMock.data, "testTitle", "testDescription")
    .then((docRef) => {})
    .catch((err) => {
      // this should cause the test to fail.
      expect(false).toBe(true);
    });
  // read the data we just wrote.
});

test("Load chart given a chart ID.", async () => {});
