
import update from 'react-addons-update'
import fetch from 'whatwg-fetch'
import Responsive from 'react-responsive'
import classNames from 'classnames'
import Cookies from 'js-cookie'

import React from 'react'
import Header from './Header.jsx'
import Chart from './Chart.jsx'
import SelectedElement from './SelectedElement.jsx'
import Shapes from './Shapes.jsx'
import MetaInfo from './MetaInfo.jsx'
import InfoColumn from './InfoColumn.jsx'
import Lanes from './Lanes.jsx'

import styles from '../styles/index.scss'


export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  render () {
    return (
      <div>
      yeeee
      	<a href="/app">Go to app!</a>
      </div>
    )
  }
}
