
import c from 'classnames'

import React from 'react'

import Header from './Header.jsx'
import ToolBar from './ToolBar.jsx'
import Chart from './Chart.jsx'
import Link from '../common/Link.jsx'

import Export from './sections/Export.jsx'
import Info from './sections/Info.jsx'
import Polyphasic from './sections/Polyphasic.jsx'
import Controls from './sections/Controls.jsx'

import Cookies from 'js-cookie';

import server from '../../server'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      napchart: false, // until it is initialized
      loading: false,
      url: window.siteUrl,
      chartid: window.chartid,
      title: window.title || '',
      description: window.description || '',
      currentSection: this.getInitialSection(),
      ampm: this.getAmpm()
    }
  }
  // <EditorHeader 
  //           onLoading={this.loading} 
  //           onLoadingFinish={this.loadingFinish}
  //           onSave={this.onSave}
  //           loading={this.state.loading}
  //           napchart={this.state.napchart}
  //           url={this.state.url}
  //           chartid={this.state.chartid}
  //           title={this.state.title}
  //           description={this.state.description} 
  //           />
  render() {

    var sections = [
      {
        element: <Controls
          napchart={this.state.napchart}
          description={this.state.description}
          changeDescription={this.changeDescription}
        />,
        text: 'Chart',
        title: 'Chart controls'
      },
      {
        element: <Export
          url={this.state.url}
          chartid={this.state.chartid}
        />,
        text: 'Share',
        title: 'Share and export'
      },
      {
        element: <Polyphasic napchart={this.state.napchart} />,
        text: 'Sleep',
        title: 'Polyphasic Sleep'
      },
      {
        element: <Info ampm={this.state.ampm} setAmpm={this.setAmpm} />,
        text: 'About',
        title: 'About'
      }
    ]

    var user = this.props.user
    var userOwnsThisChart = typeof window.chartAuthor != 'undefined' && this.props.user.username == window.chartAuthor

    return (
      <div className="Editor">
        <div className={c("grid", { slideSidebarMobile: this.state.slideSidebarMobile })}>
          <div className="sidebar">
            <Header
              title={this.state.title}
              changeTitle={this.changeTitle}
              chartid={this.state.chartid}
              save={this.save}
              user={this.props.user}
              userOwnsThisChart={userOwnsThisChart}
              loading={this.state.loading}
            />


            <div className="sidebarContent">
              <div className="sideLane">
                <div className="up">
                  {sections.map((section, i) =>
                    <button onClick={this.changeSection.bind(null, i)} key={i}
                      className={c("squareBtn", { 'active': (i == this.state.currentSection) })}>
                      {section.text}
                    </button>
                  )}
                </div>
                <div className="down">
                  <a href="https://blog.napchart.com/" target="_blank" >
                    <button className="squareBtn">
                      Blog
                    </button>
                  </a>
                </div>
              </div>

              <div className="otherLane">
                <ToolBar napchart={this.state.napchart} title={sections[this.state.currentSection].title} />
                <div className="currentInfo">

                  {sections[this.state.currentSection].element}
                </div>
              </div>
            </div>
          </div>

          <div className="main">
            <Chart
              napchart={this.state.napchart}
              onUpdate={this.somethingUpdate}
              setGlobalNapchart={this.setGlobalNapchart}
              onLoading={this.loading} onLoadingFinish={this.loadingFinish}
              ampm={this.state.ampm}
            />
          </div>
        </div>

        {this.state.slideSidebarMobile &&
          <button className="button is-light is-large slider left" onClick={this.slideSidebarMobile}>
            →
          </button>
        }
        {!this.state.slideSidebarMobile &&
          <button className="button is-light is-large slider right" onClick={this.slideSidebarMobile}>
            ←
          </button>
        }
      </div>
    )
  }

  slideSidebarMobile = () => {
    this.setState({
      slideSidebarMobile: !this.state.slideSidebarMobile
    })
  }

  changeSection = (i) => {
    this.setState({
      currentSection: i
    })
  }

  setGlobalNapchart = (napchart) => {
    this.setState({
      napchart: napchart
    })
  }

  somethingUpdate = (napchart) => {
    this.forceUpdate()
  }

  loadingFinish = () => {
    this.setState({
      loading: false
    })
  }

  loading = () => {
    this.setState({
      loading: true
    })
  }

  save = () => {
    this.loading()
    var firstTimeSave = !this.props.chartid
    server.save(this.state.napchart.data, this.state.title,
      this.state.description, (chartid) => {
        this.loadingFinish()
        this.onSave(chartid)
        if (firstTimeSave) {
        }
      })
  }

  onSave = (chartid) => {
    // this.setState({
    //   chartid
    // })

    // refresh (feels better for the user)
    window.location = '/' + chartid + '?s=1'
  }

  changeTitle = event => {
    this.setState({
      title: event.target.value
    })
  }

  changeDescription = event => {
    this.setState({
      description: event.target.value
    })
  }

  setNumberOfLanes = (lanes) => {
    console.log(lanes)
    this.state.napchart.setNumberOfLanes(lanes)
  }

  getAmpm = () => {

    const cookiePref = Cookies.get('preferAmpm')
    if (cookiePref) {
      return eval(cookiePref)
    }

    var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    var dateString = date.toLocaleTimeString();

    //apparently toLocaleTimeString() has a bug in Chrome. toString() however returns 12/24 hour formats. If one of two contains AM/PM execute 12 hour coding.
    if (dateString.match(/am|pm/i) || date.toString().match(/am|pm/i)) {
      return true
    }
    else {
      return false
    }
  }

  setAmpm = (ampm) => {
    Cookies.set('preferAmpm', ampm)

    this.setState({
      ampm: ampm
    })
  }

  getInitialSection = () => {
    // should always return 0 except when s=1 found in url, because
    // then the user just saved chart and we will show share section instead

    if (window.location.toString().includes('s=1')) {
      return 1
    }

    return 0
  }
}
