import React from 'react'

import { Logo } from '../components/common/Logo'
import Head from 'next/head'
import Button from '../components/common/Button'
import { QuickSeo } from 'next-quick-seo'
import { SuperLink } from '../components/common/SuperLink'

const TITLE = 'Napchart - Polyphasic Sleep Planner Calculator'
const DESCRIPTION =
  'Plan your sleep and visualize complex time schedules with this sleep planner. All-in-one suite for sleep hacking and bio-optimization.'
const URL = 'https://napchart.com/'

export default class Index extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="bg-yellow-50 min-h-screen">
        <QuickSeo title={TITLE} description={DESCRIPTION} />
        <Head>
          <meta property="og:url" content={URL} />
          <link rel="canonical" href={URL} />

          <meta property="og:site_name" content="Napchart" />
          <meta name="twitter:card" content="summary_large_image" />

          <meta name="twitter:creator" content={'larskarbo'} />
        </Head>

        <section className="pt-36 w-full flex flex-col justify-center items-center">
          <Logo height={200} />
          <div className="text-3xl">Napchart</div>
          <div className="text-sm my-2">24H Time visualizer</div>
          <div className="my-16">
            <SuperLink href="/app">
              <Button>Enter</Button>
            </SuperLink>
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
