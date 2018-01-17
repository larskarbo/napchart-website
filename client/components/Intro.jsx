
import classNames from 'classnames'

import React from 'react'

import styles from '../styles/index.scss'

import HeaderElement from './HeaderElement.jsx'
import Logo from './Logo.jsx'
import ShowOffCircleChart from './ShowOffCircleChart.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  render () {
    return (
      <div className="intro">
        <div className='header'>
          <HeaderElement className="center" href="/app">
            <Logo white noInteraction logoText="GO TO APP" height="45" />
          </HeaderElement>
        </div>

        <div className="bigLogo">
          <Logo height="150" whiteBG />
        </div>

        <div className="segment">
          <h2>Visualize complex time schedules</h2>

          <ShowOffCircleChart width="400" height="400" />
        </div>
      </div>
    )
  }
}
