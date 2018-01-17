import React from 'react'

import App from './App.jsx';
import Intro from './Intro.jsx';

export default class Router extends React.Component {
  render() {
    if(this.props.pathname == '/'){
    	return <Intro />
    } else {
    	return <App />
    }
  }
}
