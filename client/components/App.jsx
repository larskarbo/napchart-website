import React from 'react'


import styles from '../styles/index.scss'

import history from '../history'
import router from './routes.jsx'

export default class Router extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentPath: history.location,
      user: false
    }
  }

  render() {
    var Component = router.resolve(location)
    return (
      <div>
        <Component user={window.user || false} />
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
