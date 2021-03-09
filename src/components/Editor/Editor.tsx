import c from 'classnames'
import Cookies from 'js-cookie'
import React from 'react'
import { Helmet } from 'react-helmet'
import NotificationSystem from 'react-notification-system'
import { AccountBar } from './AccountBar'
import Chart from './Chart'
import { ChartProvider, useChart } from './chart-context'
import { Header } from './Header'
import { Controls } from './sections/Controls'
import Export from './sections/Export'
import { Info } from './sections/Info'
import Polyphasic from './sections/Polyphasic'
import ToolBar from './ToolBar'

export default function Editor({ chartid }) {
  return (
    <ChartProvider chartid={chartid}>
      <Int chartid={chartid} />
    </ChartProvider>
  )
}

function Int() {
  const { chartid, loading, title, description, chartData, setTitle, setDescription } = useChart()

  if (chartid && loading) {
    return 'Loading...'
  }
  return (
    <App
      setTitle={setTitle}
      setDescription={setDescription}
      chartid={chartid}
      loading={loading}
      title={title}
      description={description}
      chartData={chartData}
    />
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      napchart: null, // until it is initialized
      loading: false,
      chartid: this.props.chartid,
      currentSection: 0,
      ampm: this.getAmpm(),
      showPopup: false,
      slideSidebarMobile: null,
      initialData: null,
    }
  }
  _notify: any = null

  componentDidMount() {
    this.setState({
      initialData: this.props.chartData,
    })
  }

  render() {
    var sections = [
      {
        element: (
          <Controls
            napchart={this.state.napchart}
            description={this.props.description}
            changeDescription={this.props.setDescription}
            changeTitle={this.props.setTitle}
            title={this.props.title}
          />
        ),
        text: 'My Charts',
        title: '',
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
          {this.props.description?.length && <meta name="description" content={this.props.description} />}
          <meta
            name="twitter:image"
            content={`https://thumb.napchart.com/api/getImage?chartid=${this.state.chartid}&width=600&height=600&shape=circle`}
          />
          <meta
            property="og:image"
            content={`https://thumb.napchart.com/api/getImage?chartid=${this.state.chartid}&width=600&height=600&shape=circle`}
          />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="600" />
          {this.props.title?.length && <title>{`${this.props.title} - Napchart`}</title>}
        </Helmet>
        <div
          className={c('grid', {
            slideSidebarMobile: this.state.slideSidebarMobile,
          })}
        >
          <div className="sidebar">
            <Header napchart={this.state.napchart} loading={this.state.loading} />

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
  }

  onSave = (chartid) => {
    // refresh (feels better for the user)
    window.location.href = '/' + chartid
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
