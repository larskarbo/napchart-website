import React from 'react'

import Logo from '../components/common/Logo'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'

const TITLE = 'Napchart - Polyphasic Sleep Planner Calculator'
const DESCRIPTION =
  'Plan your sleep and visualize complex time schedules with this sleep planner. All-in-one suite for sleep hacking and bio-optimization.'
const URL = 'https://napchart.com/'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta property="og:url" content={URL} />
          <link rel="canonical" href={URL} />
          <title>{TITLE}</title>
          <meta property="og:title" content={TITLE} />
          <meta name="twitter:title" content={TITLE} />
          <meta name="title" content={TITLE} />

          <meta name="description" content={DESCRIPTION} />
          <meta property="og:description" content={DESCRIPTION} />
          <meta name="twitter:description" content={DESCRIPTION} />

          <meta property="og:site_name" content="Napchart" />
          <meta name="twitter:card" content="summary_large_image" />

          <meta name="twitter:creator" content={'larskarbo'} />
        </Helmet>

        <section className="section hero is-dark is-bold is-fullheight">
          <div className="hero-body">
            <div className="column has-text-centered">
              <div className="bigLogo">
                <Logo noInteraction logoText="Napchart" height="150" />
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <Link to="/app">
              <Logo white noInteraction logoText="GO TO APP" height="45" />
            </Link>
          </div>
        </section>

        <section className="section hero is-light">
          <div className="hero-body">
            <div className="container">
              <div className="columns">
                <div className="column has-text-centered">
                  <h1 className="title is-3">Visualize complex time schedules</h1>

                  <video src="/chartvideo.mp4" poster="/chartvideothumb.png" autoPlay loop muted></video>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section hero is-warning">
          <div className="hero-body">
            <div className="container">
              <div className="columns">
                <div className="column has-text-centered vertical-align-center">
                  <h2 className="title is-4">Ultimate sharing experience</h2>
                  <p>Save a chart with one click, and share the unique link with the world.</p>
                </div>
                <div className="column has-text-centered">
                  <img src="/save.png" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section hero is-light">
          <div className="hero-body">
            <div className="container">
              <div className="columns rtl">
                <div className="column has-text-centered vertical-align-center">
                  <h2 className="title is-2">Experiment with polyphasic sleep</h2>
                  <p>
                    Napchart has over 20 polyphasic sleep presets and is often used by the community to share, discuss
                    and plan schedules
                  </p>
                </div>
                <div className="column has-text-centered">
                  <img src="/polyphasic.png" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section hero is-dark">
          <div className="hero-body">
            <div className="container has-text-centered">
              <a href="/app" className="button">
                <Logo whiteBG noInteraction logoText="GO TO APP" height="45" />
              </a>
            </div>
          </div>

          <div className="hero-foot">
            <div className="container has-text-centered">
              <p>
                <a target="_blank" href="fjdi">
                  <strong>napchart-website</strong>
                </a>{' '}
                on GitHub
              </p>
              <p>
                <a target="_blank" href="fjdi">
                  <strong>napchart</strong>
                </a>{' '}
                on GitHub
              </p>
              <p>
                {/* <a target="_blank" href="https://drowzee.com/waking-up-middle-of-night/">
                  <strong>Waking up in the middle of the night?</strong>
                </a> */}
              </p>
              <p>
                🌟 Copyright 2013-2021 <a href="https://larskarbo.no/">Lars Karbo</a> 🌟
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }
}