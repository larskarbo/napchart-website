import * as firebase from "@firebase/testing";
import { FirebaseServer } from "../firebase_server";
import { Server } from "../server";
import { assert } from "console";
import { FirebaseFirestore } from "@firebase/firestore-types";

var server: Server;
beforeEach(() => {
  const testApp: any = firebase.initializeTestApp({
    projectId: "napchart-1abe4",
    auth: { uid: "juanitotaveras", email: "alice@example.com" },
  });
  if (firebase == null) {
    assert(false);
  }
  FirebaseServer.init(testApp);
  server = FirebaseServer.getInstance();
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

test("If user is not signed in, save schedule to noauthor-charts collection.", async () => {});

test("If user is signed in, save schedule to directory with their ID", async () => {});
