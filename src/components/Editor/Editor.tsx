import c from 'classnames'

import React from 'react'

import Header from './Header'
import ToolBar from './ToolBar'
import Chart from './Chart'
import { Helmet } from 'react-helmet'

import Export from './sections/Export'
import { Info } from './sections/Info'
import Polyphasic from './sections/Polyphasic'
import { Controls } from './sections/Controls'

import Cookies from 'js-cookie'
import NotificationSystem from 'react-notification-system'
import { FirebaseServer } from '../../server/FirebaseServer'

import { Server } from '../../server/Server'
import { NapChart } from './napchart'
import { ChartData } from '../../server/ChartData'

const myTheme = {
  global: {
    colors: {
      brand: '#EA4335',
    },
  },
}

type AppProps = {
  server: Server
  chartid?: any
}

type AppState = {
  napchart: NapChart | null
  loading: boolean
  chartid?: any
  title: string
  description: string
  currentSection: any
  ampm: boolean
  showPopup: boolean
  slideSidebarMobile: any
  initialData: ChartData | null
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      napchart: null, // until it is initialized
      loading: false,
      chartid: this.props.chartid,
      title: '',
      description: '',
      currentSection: 0,
      ampm: this.getAmpm(),
      showPopup: false,
      slideSidebarMobile: null,
      initialData: null,
    }
  }
  _notify: any = null

  componentDidMount() {
    if (this.state.chartid) {
      this.setState({ loading: true })
      FirebaseServer.getInstance()
        .loadChart(this.state.chartid)
        .then((chartData) => {
          console.log('setting initial data')
          console.log(chartData)
          this.setState({
            initialData: chartData,
            title: chartData.title,
            description: chartData.description,
            loading: false,
          })
        })
    }
  }

  render() {
    var sections = [
      {
        element: (
          <Controls
            napchart={this.state.napchart}
            description={this.state.description}
            changeDescription={this.changeDescription}
          />
        ),
        text: 'My Charts',
        title: 'Chart controls',
      },
      {
        element: <Export chartid={this.state.chartid} />,
        text: 'Share',
        title: 'Share and export',
      },
      {
        element: <Polyphasic napchart={this.state.napchart} />,
        text: 'Sleep',
        title: 'Polyphasic Sleep',
      },
      {
        element: <Info ampm={this.state.ampm} setAmpm={this.setAmpm} />,
        text: 'About',
        title: 'About',
      },
    ]

    return (
      <div className="Editor">
        <NotificationSystem ref={(notificationSystem) => (this._notify = notificationSystem)} />
        <Helmet>
          {this.state.description.length && <meta name="description" content={this.state.description} />}
          <meta
            name="twitter:image"
            content={`http://thumb.napchart.com:1771/api/getImage?chartid=${this.state.chartid}&width=600&height=600&shape=circle`}
          />
          <meta
            property="og:image"
            content={`http://thumb.napchart.com:1771/api/getImage?chartid=${this.state.chartid}&width=600&height=600&shape=circle`}
          />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
          {this.state.title.length && <title>{`${this.state.title} - Napchart`}</title>}
        </Helmet>
        <div
          className={c('grid', {
            slideSidebarMobile: this.state.slideSidebarMobile,
          })}
        >
          <div className="sidebar">
            <Header
              title={this.state.title}
              changeTitle={this.changeTitle}
              chartid={this.state.chartid}
              save={this.save}
              loading={this.state.loading}
            />

            <div className="sidebarContent">
              <div className="sideLane">
                <div className="up">
                  {sections.map((section, i) => (
                    <button
                      onClick={this.changeSection.bind(null, i)}
                      key={i}
                      className={c('squareBtn', {
                        active: i == this.state.currentSection,
                      })}
                    >
                      {section.text}
                    </button>
                  ))}
                </div>
                <div className="down"></div>
              </div>

              <div className="otherLane">
                <ToolBar napchart={this.state.napchart} title={sections[this.state.currentSection].title} />
                <div className="currentInfo">
                  {sections[this.state.currentSection].element}
                  {this.state.currentSection != 1 && (
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
                        <p>I am working on a new big upgrade to Napchart and this week I am doing user interviews.</p>
                        <p>
                          Schedule a quick call here:{' '}
                          <a href="https://calendly.com/larskarbo/napchart-call">schedule</a>
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
            <Chart
              napchart={this.state.napchart}
              initialData={this.state.initialData}
              setGlobalNapchart={this.setGlobalNapchart}
              onUpdate={this.somethingUpdate}
              setMetaInfo={this.setMetaInfo}
              ampm={this.state.ampm}
            />
          </div>
        </div>

        {this.state.slideSidebarMobile && (
          <button className="button is-light is-large slider left" onClick={this.slideSidebarMobile}>
            →
          </button>
        )}
        {!this.state.slideSidebarMobile && (
          <button className="button is-light is-large slider right" onClick={this.slideSidebarMobile}>
            ←
          </button>
        )}
      </div>
    )
  }

  slideSidebarMobile = () => {
    this.setState({
      slideSidebarMobile: !this.state.slideSidebarMobile,
    })
  }

  changeSection = (i) => {
    this.setState({
      currentSection: i,
    })
  }

  setGlobalNapchart = (napchart) => {
    this.setState({
      napchart: napchart,
    })
  }

  setMetaInfo = (title, description) => {
    console.log('title, description: ', title, description)
    this.setState({
      title,
      description,
    })
  }

  somethingUpdate = (napchart) => {
    this.forceUpdate()
  }

  loadingFinish = () => {
    this.setState({
      loading: false,
    })
  }

  loading = () => {
    this.setState({
      loading: true,
    })
  }

  save = () => {
    this.setState({
      loading: true,
    })
    this.props.server
      .save(this.state.napchart!.data, this.state.title, this.state.description)
      .then((chartid) => {
        this.loadingFinish()
        this.onSave(chartid)
        this.setState({ chartid: chartid })
      })
      .catch((err) => {
        console.error("things didn't work... " + err)
        this._notify.addNotification({
          message: JSON.stringify(err),
          level: 'error',
        })
      })
  }

  onSave = (chartid) => {
    // refresh (feels better for the user)
    window.location.href = '/' + chartid
  }

  changeTitle = (event) => {
    this.setState({
      title: event.target.value,
    })
  }

  changeDescription = (event) => {
    this.setState({
      description: event.target.value,
    })
  }

  setNumberOfLanes = (lanes) => {
    this.state.napchart!.setNumberOfLanes(lanes)
  }

  getAmpm = (): boolean => {
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

  setAmpm = (ampm) => {
    Cookies.set('preferAmpm', ampm)

    this.setState({
      ampm: ampm,
    })
  }
}
