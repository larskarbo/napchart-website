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
  await server
    .save("", "", "")
    .then((chartid) => {})
    .catch((err) => {
      // this should cause the test to fail.
      expect(false).toBe(true);
    });
  // read the data we just wrote.
});

test("If user is not signed in, save schedule to noauthor-charts collection.", async () => {
  mockAuthProvider.isUserSignedIn = () => false;

  server
    .save(napChartMock.data, "testTitle", "testDescription")
    .then((docRef) => {
      // Assert that this data has been saved to noauthor-charts collection.
    });
});

test("If user is signed in, save schedule to directory with their ID", async () => {
  mockAuthProvider.isUserSignedIn = () => true;

  server
    .save(napChartMock.data, "testTitle", "testDescription")
    .then((docRef) => {
      // Assert that this data has been saved to the username's document.
    });
});
