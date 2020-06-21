import { Server } from "./server";
import { ServerImpl } from "./server_impl";
import * as firebase from "firebase/app";
import { NapChart } from "../components/Editor/napchart";
import App from "../components/Editor/Editor";
import { FireObject } from "@testing-library/react";
import { FirebaseFirestore } from "@firebase/firestore-types";
import { NapchartData } from "napchart";
import { AuthProvider } from "../auth/auth_provider";
import { firebaseAuthProvider } from "../auth/firebase_auth_provider";
require("firebase/firestore");

/*
If user is not signed in, 
*/
export interface FirebaseServerProps {
  testApp?: App | any;
  authProvider: AuthProvider;
}
export class FirebaseServer implements Server {
  private static instance: FirebaseServer;
  private db!: FirebaseFirestore;

  static getInstance(): FirebaseServer {
    if (!FirebaseServer.instance) {
      console.error("Fatal error. Firebase app not initialized.");
    }
    return FirebaseServer.instance;
  }

  static resetState() {
    console.log("Note: This method should only be called within unit tests.");
    FirebaseServer.instance = undefined as any;
  }

  static init(props: FirebaseServerProps) {
    if (!FirebaseServer.instance) {
      // If this is not a unit test, initialize Firebase normally.
      FirebaseServer.instance = new FirebaseServer();
      if (props.testApp == undefined || props.testApp == null) {
        const firebaseConfig = {
          apiKey: "AIzaSyDZIH0Vogv07ZWCUMwPn1gaBaF_6rAP_zg",
          authDomain: "napchart-1abe4.firebaseapp.com",
          databaseURL: "https://napchart-1abe4.firebaseio.com",
          projectId: "napchart-1abe4",
          storageBucket: "napchart-1abe4.appspot.com",
          messagingSenderId: "747326670843",
          appId: "1:747326670843:web:39891acdbdf5df1cd8ed5e",
          measurementId: "G-NP62410MLV",
        };
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        FirebaseServer.instance.db = firebase.firestore(firebaseApp);
        // If we are testing locally, use the emulator.
        if (window.location.hostname == "localhost") {
          FirebaseServer.instance.db.settings({
            ssl: false,
            host: "localhost:8080",
          });
        }
      } else {
        FirebaseServer.instance.db = firebase.firestore(props.testApp);
      }
    } else {
      console.error(
        "FATAL ERROR: You should only call init() once, because this is a singleton."
      );
    }
  }

  loadChartsForUser(userId: number) {
    const promise = this.db
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
      });
    return promise;
  }
  save(data: NapchartData, title: string, description: string) {
    if (firebaseAuthProvider.isUserSignedIn()) {
      const userId = firebaseAuthProvider.getUserId();
      if (userId !== undefined) {
        return this.db.collection("charts").doc(userId).set({ data });
      }
    }

    return this.db.collection("charts").add({
      data,
    });

    // then() returns docRef
    // error() returns err
  }
  loadChart() {
    // first check if fetch is needed
    let chartid: string | null = null;
    if (window.location.pathname.length == 6) {
      chartid = window.location.pathname.substring(1);
    }

    if (!chartid) {
      console.log("no chartid, nothing to load");
      return Promise.reject("No chartID");
    }

    this.db.collection("charts").get();

    // const query = new Parse.Query(Chart);
    // query.equalTo("chartid", chartid);
    // const results = await query.find();
    // console.log("results: ", results);
    // const chart = results[0];
    // console.log();
    // const data = {
    //   id: chartid,
    //   ...chart.get("chartData"),
    //   metaInfo: {
    //     title: chart.get("title"),
    //     description: chart.get("description")
    //   }
    // };
    return Promise.resolve();
  }
  sendFeedback(feedback: any) {}
  addEmailToFeedback(email: any, feedbackId: any) {}
}
