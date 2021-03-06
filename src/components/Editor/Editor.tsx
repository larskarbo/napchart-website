import c from 'classnames'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { isLocal } from '../common/isLocal'
import { AccountBar } from './AccountBar'
import Chart from './Chart'
import { ChartProvider, useChart } from './chart-context'
import { Header } from './Header'
import { PremiumModal } from './PremiumModal'
import { Controls } from './sections/Controls'
import Export from './sections/Export'
import { Info } from './sections/Info'
import Polyphasic from './sections/Polyphasic'
import ToolBar from './ToolBar'

export default function Editor({ chartid }) {
  return (
    <ChartProvider chartid={chartid}>
      <App />
    </ChartProvider>
  )
}

const getAmpm = (): boolean => {
  const cookiePref = Cookies.get('preferAmpm')
  if (cookiePref) {
    return eval(cookiePref)
  }

  var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0))
  var dateString = date.toLocaleTimeString()

  //apparently toLocaleTimeString() has a bug in Chrome. toString() however returns 12/24 hour formats. If one of two contains AM/PM execute 12 hour coding.
  if (dateString.match(/am|pm/i) || date.toString().match(/am|pm/i)) {
    return true
  } else {
    return false
  }
}

function App() {
  const { chartid, loading, title, description, chartData, setTitle, setDescription } = useChart()
  const [_, setRandom] = useState(4)
  const [slideSidebarMobile, setSlideSidebarMobile] = useState(false)
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [napchartObject, setNapchartObject] = useState(null)
  const [amPm, setAmPm] = useState(getAmpm())
  if (chartid && loading) {
    return <div>'Loading...'</div>
  }

  const setAmPmAndCookie = (newAmPm) => {
    Cookies.set('preferAmpm', newAmPm)

    setAmPm(newAmPm)
  }

  var sections = [
    {
      element: (
        <Controls
          napchart={napchartObject}
          description={description}
          changeDescription={setDescription}
          changeTitle={setTitle}
          title={title}
        />
      ),
      text: 'My Charts',
      title: '',
    },
    {
      element: <Export chartid={chartid} />,
      text: 'Share',
      title: 'Share and export',
    },
    {
      element: <Polyphasic napchart={napchartObject} />,
      text: 'Sleep',
      title: 'Polyphasic Sleep',
    },
    {
      element: <Info ampm={amPm} setAmpm={setAmPmAndCookie} />,
      text: 'About',
      title: 'About',
    },
  ]

  return (
    <div className="Editor relative">
      <Helmet>
        {description?.length && <meta name="description" content={description} />}
        <meta
          name="twitter:image"
          content={`https://thumb.napchart.com/api/getImage?chartid=${chartid}&width=600&height=600&shape=circle`}
        />
        <meta
          property="og:image"
          content={`https://thumb.napchart.com/api/getImage?chartid=${chartid}&width=600&height=600&shape=circle`}
        />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        {title?.length ? <title>{`${title} - Napchart`}</title> : <title>{`Unnamed Napchart`}</title>}
      </Helmet>

      {showPremiumPopup && <PremiumModal exit={() => setShowPremiumPopup(false)} />}

      <div
        className={c('grid', {
          slideSidebarMobile: slideSidebarMobile,
        })}
      >
        <div className="sidebar">
          <Header napchart={napchartObject} />

          <div className="sidebarContent">
            <div className="bg-gray-700 pt-24">
              {sections.map((section, i) => (
                <button
                  onClick={() => setCurrentSection(i)}
                  key={i}
                  className={`text-white w-full h-16
                    ${i == currentSection && 'bg-red-600'}
                    `}
                >
                  {section.text}
                </button>
              ))}
              {isLocal() && (
                <button
                  onClick={() => {
                    setShowPremiumPopup(true)
                  }}
                  className={'text-white w-full h-16'}
                >
                  Premium
                </button>
              )}
            </div>

            <div className="otherLane">
              <ToolBar napchart={napchartObject} title={sections[currentSection].title} />
              <div className="currentInfo">
                {sections[currentSection].element}
                {currentSection != 1 && (
                  <div
                    className="dz"
                    style={{
                      marginTop: 10,
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                      }}
                    >
                      <h2>I need your opinion</h2>
                      <p>I am working on a new big upgrade to Napchart!</p>
                      <p>
                        Reach out to me{' '}
                        <a className="underline blue" href="https://www.reddit.com/user/gaptrast">
                          on reddit
                        </a>
                      </p>
                    </div>
                    <div
                      style={{
                        width: '50%',
                        paddingLeft: 4,
                      }}
                    >
                      <img src="/nextgen.png" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="absolute right-0 top-0">
            <AccountBar />
          </div>
          <Chart
            napchartObject={napchartObject}
            chartData={chartData}
            setGlobalNapchart={setNapchartObject}
            amPm={amPm}
            onUpdate={() => setRandom(Math.random())}
          />
        </div>
      </div>

      {slideSidebarMobile && (
        <button
          className="button is-light is-large slider left"
          onClick={() => setSlideSidebarMobile(!slideSidebarMobile)}
        >
          →
        </button>
      )}
      {!slideSidebarMobile && (
        <button
          className="button is-light is-large slider right"
          onClick={() => setSlideSidebarMobile(!slideSidebarMobile)}
        >
          ←
        </button>
      )}
    </div>
  )
}
