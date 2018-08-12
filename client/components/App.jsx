import React from 'react'


import styles from '../styles/index.scss'

import history from '../history'
import router from './routes.jsx'

export default class Router extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentPath: history.location
    }
  }

  render() {
    var Component = router.resolve(window.location)
    return (
      <div>
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
