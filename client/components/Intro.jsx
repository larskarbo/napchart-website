
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
          <Logo noInteraction height="150" whiteBG />
        </div>

        <div className="segment">
          <h1>Visualize complex time schedules</h1>

          <video src="/public/chartvideo.mp4" poster="/public/chartvideothumb.png" autoPlay loop muted>
          </video>
        </div>

        <div className="segment">
          <div className="row">
            <div className="col">
              <h2>Ultimate sharing experience</h2>
              <p>Save a chart with one click, and share the unique link with the world.</p>
            </div>
            <div className="col">
              <img src="/public/save.png" />
            </div>
          </div>
        </div>

        <div className="segment">
          <div className="row rtl">
            <div className="col">
                <h2>Experiment with polyphasic sleep</h2>
                <p>Napchart has over 20 polyphasic sleep presets and is often
                used by the community to share, discuss and plan schedules</p>
            </div>
            <div className="col">
              <img src="/public/polyphasic.png" />
            </div>
          </div>
        </div>


        <div className="segment">
          <a href="/app"><button className="button">
            <Logo whiteBG noInteraction logoText="GO TO APP" height="45" />
          </button></a>
        </div>

        <div className="segment end">
          <p><a target="_blank" href="fjdi"><strong>napchart-website</strong></a> on GitHub</p>
          <p><a target="_blank" href="fjdi"><strong>napchart</strong></a> on GitHub</p>
          <p>🌟 Copyright 2013-2018 Lars Karbo 🌟</p>
        </div>

      </div>
    )
  }
}
