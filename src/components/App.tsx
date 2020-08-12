import React from 'react'

import '../styles/index.scss'

import Editor from './Editor/Editor'
import ChartBrowser from './ChartBrowser/ChartBrowser'
import Intro from './Intro/Intro'
import { FirebaseServer } from '../server/FirebaseServer'

import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/app">
            <Editor server={FirebaseServer.getInstance()} />
          </Route>
          <Route path="/charts">
            <ChartBrowser server={FirebaseServer.getInstance()} />
          </Route>
          <Route path="/:chartid">
            <EditorWithChartID />
          </Route>
          <Route path="/">
            <Intro />
          </Route>
        </Switch>
      </Router>
    )
  }
}

function EditorWithChartID() {
  // kind of hacky, TODO make it cleaner, get chartid from
  // the actual Editor component

  let { chartid } = useParams()

  return <Editor chartid={chartid} server={FirebaseServer.getInstance()} />
}
