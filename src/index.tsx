/*
    ./client/index.js
    which is the webpack entry file
*/

import React from "react";
import { render } from "react-dom";

import Router from "./components/App";
import { FirebaseServer } from "./server/firebase_server";
FirebaseServer.init();
render(<Router />, document.getElementById("root"));
