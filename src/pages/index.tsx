import React from 'react'

import Logo from '../components/common/Logo'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import Button from '../components/common/Button'

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
      <div className="bg-yellow-50">
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

        <section className="min-h-screen w-full flex flex-col justify-center items-center">
          <Logo logoText="Napchart" height="200" />
          <div className="text-3xl">Napchart</div>
          <div className="text-sm my-2">24H Time visualizer</div>
          <div className="my-32">
            <Link to="/app">
              <Button>Enter</Button>
            </Link>
          </div>
        </section>


        <div className="flex justify-center">
          <p>
            🌟 Copyright 2013-2023 <a className="underline text-black" href="https://larskarbo.no/">Lars Karbo</a> 🌟
          </p>
        </div>
      </div>
    )
  }
}
