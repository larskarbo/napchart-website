import React from 'react'


import styles from '../styles/index.scss'

import history from '../utils/history'
import router from './routes.js'

// import serverCom from '../utils/serverCom'


export default class Router extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentPath: history.location,
      user: null
    }
  }

  render() {
    var Component = router.resolve(window.location)
    return (
      <div>
        <div
          style={{
            display: (this.state.user == null) ? 'none' : 'block'
          }}
          id="firebaseui-auth-container"
        ></div>
        <Component />
      </div>
    )
  }

  componentDidMount() {
    history.listen((location) => {
      this.setState({
        currentPath: location
      })
    });
  }
}
