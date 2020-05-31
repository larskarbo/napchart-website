import React from 'react'


import '../styles/index.scss'

import history from '../history'
import router from './routes'

export default class Router extends React.Component {
  constructor(props: any){
    super(props)

    this.state = {
      currentPath: history.location
    }
  }

  render() {
    var Component = router.resolve(window.location)
    return (Component)
  }

  componentDidMount() {
    history.listen((location) => {
      this.setState({
        currentPath: location
      })
    });
  }
}
