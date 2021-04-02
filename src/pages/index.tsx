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
      <div className="bg-yellow-50 min-h-screen">
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

        <section className="pt-36 w-full flex flex-col justify-center items-center">
          <Logo logoText="Napchart" height="200" />
          <div className="text-3xl">Napchart</div>
          <div className="text-sm my-2">24H Time visualizer</div>
          <div className="my-16">
            <Link to="/app">
              <Button>Enter</Button>
            </Link>
          </div>
        </section>

        <div className="flex center">
          <div className="mt-16">
            <a href="https://larskarbo.no" target="_blank">
              <div
                className=" flex items-center border border-gray-200 rounded p-2 px-4
                hover:border-gray-400 transition-colors duration-150 hover:shadow-sm
                "
              >
                <img
                  alt="Lars"
                  className="rounded-full mr-2 w-8"
                  src="https://s.gravatar.com/avatar/4579b299730ddc53e3d523ec1cd5482a?s=72"
                />
                <div className="font-light">
                  made by <strong className="font-bold">@larskarbo</strong>
                </div>
              </div>
            </a>
            <a
              href="https://www.producthunt.com/posts/napchart?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-napchart"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=290488&theme=light"
                alt="Napchart - 24-hour time visualizer | Product Hunt"
                width="250"
                height="54"
                className="mt-6"
              />
            </a>
          </div>
        </div>
        <div className="pb-24"></div>

        <div className="flex justify-center">
          <p>
            🌟 Copyright 2013-2023{' '}
            <a className="underline text-black" href="https://larskarbo.no/">
              Lars Karbo
            </a>{' '}
            🌟
          </p>
        </div>
      </div>
    )
  }
}
