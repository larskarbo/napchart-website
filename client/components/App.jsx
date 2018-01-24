import React from 'react'

import Editor from './Editor/Editor.jsx'
import Intro from './Intro/Intro.jsx'
import Blog from './Blog/Blog.jsx'

import styles from '../styles/index.scss'

import history from '../history'
import pathToRegexp from 'path-to-regexp'

export default class Router extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentPath: history.location,
      user: false
    }
    window.pathToRegexp = pathToRegexp
  }

  render() {
    // looks messy but is ok for now
    var path = this.state.currentPath.pathname
    if(path == '/'){
    	return <Intro user={this.state.user} />
    } else if(path == '/blog') {
      return <Blog user={this.state.user} />
    } else if(pathToRegexp('/blog/:article').exec(path)) {
      var article = pathToRegexp('/blog/:article').exec(path)[1]
      return <Blog user={this.state.user} article={articl} />
    } else if(path == '/login') {
      return <Login user={this.state.user} />
    } else if(pathToRegexp('/:chartid').exec(path)) {
      var chartid = pathToRegexp('/:chartid').exec(path)[1]
      return <Editor user={this.state.user} chartid={chartid} />
    } else if(path == '/app') {
      return <Editor user={this.state.user} />
    } else if(pathToRegexp('/user/:username').exec(path)) {
      var username = pathToRegexp('/:username').exec(path)[1]
      return <User user={this.state.user} username={username} />
    } else {
      return (
        <div>
          404 :/
        </div>
      )
    }
  }

  componentDidMount() {
    history.listen((location) => {
      this.setState({
        currentPath: location
      })
    });
  }

}
