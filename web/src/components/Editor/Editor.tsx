import c from 'clsx'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { getProperLink } from '../../utils/getProperLink'
import { BASE } from '../../utils/request'
import Button from '../common/Button'
import Nav from '../common/Nav'
import { AccountBar } from './AccountBar'
import Chart from './Chart'
import { ChartProvider, useChart } from './chart-context'
import { Header } from './Header'
import { Controls } from './sections/Controls'
import Export from './sections/Export'
import { Contact, Info } from './sections/Info'
import Polyphasic from './sections/Polyphasic'
import ToolBar from './ToolBar'
import WarnExit from './WarnExit'

export default function Editor({ chartid=null, username=null, initialData=null }) {
  console.log('initialData here: ', initialData);

  // let realChartId
  // if (chartid) {
  //   realChartId = chartid
  // } else if (titleAndChartid) {
  //   if (/(\w|\d){9}/.test(titleAndChartid.slice(-9))) {
  //     realChartId = titleAndChartid.slice(-9)
  //   } else {
  //     const lastPart = titleAndChartid.split('-').pop()
  //     if (lastPart.length == 5 || lastPart.length == 6) {
  //       realChartId = lastPart
  //     }
  //   }
  // } else if (oldchartid) {
  // if (oldchartid.length == 5 || oldchartid.length == 6) {
  //   realChartId = oldchartid
  // }
  // }

  // if (!realChartId && !isApp) {
  //   router.replace('/404')
  // }

  return (
    <ChartProvider
      chartid={chartid}
       initialData={initialData}
    >
      <App pathUsername={username} />
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

function App({ pathUsername }) {
  const {
    chartid,
    loading,
    isSnapshot,
    title,
    description,
    chartDataSlow,
    chartDocument,
    chartOwner,
    setDirty,
    readOnly,
  } = useChart()

  const [_, setRandom] = useState(4)
  const [slideSidebarMobile, setSlideSidebarMobile] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [napchartObject, setNapchartObject] = useState(null)

  const [amPm, setAmPm] = useState(getAmpm())

  useEffect(() => {
    if (isSnapshot) {
      history.replaceState({}, '', `/snapshot/${chartid}`)
    } else if (chartOwner) {
      if (chartOwner == 'anonymous' || chartOwner == 'thumbbot') {
        history.replaceState({}, '', `/${chartid}`)
      } else {
        history.replaceState({}, '', getProperLink(chartOwner, title, chartid))
      }
      // history.replaceState({}, '', `/user/${chartOwner}/chart/${urlTitle}${chartid}`)
      // navigate(`/user/${chartOwner}/chart/${urlTitle}${chartid}`, { replace: true })
    }
  }, [chartOwner, title, isSnapshot])

  if (chartid && loading) {
    return <div>'Loading...'</div>
  }

  const setAmPmAndCookie = (newAmPm) => {
    Cookies.set('preferAmpm', newAmPm)

    setAmPm(newAmPm)
  }

  var sections = [
    {
      element: <Controls napchart={napchartObject} />,
      text: 'Chart',
      title: '',
    },
    {
      element: <Export />,
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
    <div className="relative">
      <WarnExit />
      <Helmet>
        {description?.length && <meta name="description" content={description} />}
        <meta name="twitter:image" content={`${BASE}/v1/getImage/${chartid}`} />
        <meta property="og:image" content={`${BASE}/v1/getImage/${chartid}`} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        {title?.length ? <title>{`${title} - Napchart`}</title> : <title>{`Unnamed Napchart`}</title>}
      </Helmet>

      <Nav activeRoute={'/app'} />

      <div
        className={c('biggrid', {
          slideSidebarMobile: slideSidebarMobile,
        })}
      >
        <div className="flex flex-col">
          <Header napchart={napchartObject} />

          <ToolBar napchart={napchartObject} />
          <div className="flex flex-row flex-grow">
            <div className="bg-gray-700 pt-24 w-16 text-sm flex-shrink-0">
              {sections.map((section, i) => (
                <button
                  onClick={() => setCurrentSection(i)}
                  key={i}
                  className={`text-white w-full h-16  font-light
                    ${i == currentSection && 'bg-red-600'}
                    `}
                >
                  {section.text}
                </button>
              ))}
            </div>

            <div className="flex flex-col justify-between px-4 bg-gray-50 w-full">
              {sections[currentSection].element}
              {currentSection != 1 && (
                <div className="flex my-4 text-xs border border-gray-300 p-2">
                  <Contact />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shadow-2xl border-l border-gray-300 relative min-h-screen">
          <div className="absolute right-0 top-0">
            <AccountBar />
          </div>
          <div className="h-screen">
            <Chart
              fullHeight
              responsive
              interactive={!readOnly}
              napchartObject={napchartObject}
              chartData={chartDataSlow}
              setGlobalNapchart={setNapchartObject}
              amPm={amPm}
              onUpdate={() => {
                setDirty(true)
                setRandom(Math.random())
              }}
            />
          </div>
        </div>
      </div>

      {slideSidebarMobile && (
        <Button className="slider left" onClick={() => setSlideSidebarMobile(!slideSidebarMobile)}>
          → Sidebar
        </Button>
      )}
      {!slideSidebarMobile && (
        <Button className="slider right py-8" onClick={() => setSlideSidebarMobile(!slideSidebarMobile)}>
          ← Sidebar
        </Button>
      )}
    </div>
  )
}
