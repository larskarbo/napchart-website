import toRegex from "path-to-regexp";

import React from "react";

import Editor from "./Editor/Editor";
import Intro from "./Intro/Intro";
import { ServerImpl } from "../server/server_impl";

const routes = [
  {
    path: "/",
    component: () => <Intro />,
  },
  {
    path: "/app",
    component: () => <Editor server={new ServerImpl()} />,
  },
  {
    path: "/:chartid",
    component: (params) => <Editor chartid={"hey"} server={new ServerImpl()} />,
  },
];

function matchURI(path, uri) {
  const keys = [];
  const pattern = toRegex(path, keys); // TODO: Use caching
  const match = pattern.exec(uri);
  if (!match) return null;
  const params = Object.create(null);
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] = match[i] !== undefined ? match[i] : undefined;
  }
  return params;
}

function resolve(context) {
  for (const route of routes) {
    const uri = context.error ? "/error" : context.pathname;
    const params = matchURI(route.path, uri);
    if (!params) continue;
    const result = route.component(params);
    if (result) return result;
  }
  const error = new Error("Not found");
  error.status = 404;
  throw error;
}

export default { resolve };
