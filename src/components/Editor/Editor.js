
import c from 'classnames'

import React from 'react'

import Header from './Header.js'
import BadBrowser from './BadBrowser.js'
import ToolBar from './ToolBar.js'
import Chart from './Chart.js'
import Link from '../common/Link.js'

import Export from './sections/Export.js'
import Info from './sections/Info.js'
import Polyphasic from './sections/Polyphasic.js'
import Controls from './sections/Controls.js'
import helpers from '../../views/react24/helpers'
import Cookies from 'js-cookie';
import NotificationSystem from 'react-notification-system'

import server from '../../utils/serverCom'
import Two24 from '../../views/two24'
import React24 from '../../views/react24'
import firebase from 'firebase'

// var config = {
//   apiKey: "AIzaSyDTg18EW6Qu52hgqJhAhn_bQsKl5XKaMG8",
//   authDomain: "napchart-v8.firebaseapp.com",
//   databaseURL: "https://napchart-v8.firebaseio.com",
//   projectId: "napchart-v8",
//   storageBucket: "napchart-v8.appspot.com",
//   messagingSenderId: "518752038140"
// };

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      url: window.location.origin + '/',
      chartid: this.getInitialChartid(),
      title: '',
      description: '',
      currentSection: 0,
      ampm: this.getAmpm(),
      elements: [
        {
          id: 'asdf',
          title: 'Krets',
          start: 8 * 60 + 15,
          end: 10 * 60 + 15,
          color: 'pink'
        },
        {
          id: 8,
          title: 'Matte 1',
          start: 0 * 60 + 15,
          end: 2 * 60 + 15,
          color: 'green'
        },
        {
          id: 2,
          title: 'Elsys',
          start: 15 * 60 + 15,
          end: 18 * 60,
          color: 'yellow'
        }
      ]
    }

    for (let i = 0; i < 50; i++) {
      this.state.elements.push({
        id: Math.random()*2000,
        title: 'Krets',
        start: helpers.limit(8 * i),
        end: helpers.limit(8 * i + 20),
        color: 'pink'
      })
      
    }

    this.ref = firebase.database().ref('charts').child('testl');
    this.ref.on('value', (snapshot) => {
      const newo = snapshot.val()

      const elements = this.denormalizeObj(newo.elements)
      this.setState({
        elements
      })
    });
  }


  save = () => {
    this.loading()
    console.log(this.normalizeArray(this.state.elements))
    // firebase.database().ref('charts').child('testl').set({
    //   elements: this.normalizeArray(this.state.elements)
    // })
    // .then((response) => {
    //   this.loadingFinish()
    // })
    // .catch((hm) => {
    //   this.loadingFinish()
    // })
  }

  changeElement = (id, newEl) => {
    console.log('🥂', id, newEl)

    this.setState({
      elements: this.state.elements.map(e => {
        if (e.id == id) {
          return {
            ...e,
            ...newEl
          }
        }
        return e
      })
    })
    this.ref.child('elements').child(id).update({
      ...newEl
    })
    .then((response) => {
    })
    .catch((hm) => {
      console.log('ERROR 👺👺👺', hm)
    })
  }

  selectElement = id => {
    this.deselect()

    // this.setState({
    //   elements: this.state.elements.map(e => {
    //     if (e.id == id) {
    //       return {
    //         ...e,
    //         selected: true
    //       }
    //     }
    //     return e
    //   })
    // })
    this.ref.child('elements').child(id).update({
      selected: true
    })
  }

  deselectElement = id => {
    this.ref.child('elements').child(id).update({
      selected: false
    })
  }

  deselect = id => {
    this.ref.child('elements').update(this.normalizeArray(this.state.elements.map(e => {
      return {
        ...e,
        selected: false
      }
    })))
  }

  render() {

    var sections = [
      {
        element: <Controls
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
        element: <Polyphasic />,
        text: 'Sleep',
        title: 'Polyphasic Sleep'
      },
      {
        element: <Info
          ampm={this.state.ampm}
          setAmpm={this.setAmpm}
        />,
        text: 'About',
        title: 'About'
      }
    ]


    return (
      <div className="Editor">
        <BadBrowser />
        <NotificationSystem ref={(notificationSystem) => this._notify = notificationSystem} />
        <div className={c("grid", { slideSidebarMobile: this.state.slideSidebarMobile })}>
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
                  {sections.map((section, i) =>
                    <button onClick={this.changeSection.bind(null, i)} key={i}
                      className={c("squareBtn", { 'active': (i == this.state.currentSection) })}>
                      {section.text}
                    </button>
                  )}
                </div>
                <div className="down">
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
            <React24
              elements={this.state.elements}
              changeElement={this.changeElement}
              selectElement={this.selectElement}
              deselectElement={this.deselectElement}
              deselect={this.deselect}
              ref={bro => this.bro = bro}
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

  // save = () => {
  //   this.loading()
  //   var firstTimeSave = !this.props.chartid
  //   server.save(this.state.napchart.data, this.state.title,
  //     this.state.description, (err, chartid) => {
  //       this.loadingFinish()
  //       if (err) {
  //         this._notify.addNotification({
  //           message: err,
  //           level: 'error'
  //         })
  //       } else {
  //         this.onSave(chartid)
  //         this.setState({
  //           // currentSection: 1,
  //           chartid: chartid
  //         })
  //         window.history.pushState({}, "", chartid);
  //       }
  //     })
  // }

  onSave = (chartid) => {
    // refresh (feels better for the user)
    // window.location = '/' + chartid + '?s=1'
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

  getInitialChartid = () => {
    // should always return 0 except when s=1 found in url, because
    // then the user just saved chart and we will show share section instead
    const lol = window.location.toString().split('/')
    return lol[lol.length - 1]
  }

  normalizeArray = (arr) => {
    const o = {}
    arr.forEach((element) => {
      o[element.id] = element
    })
    return o
  }

  denormalizeObj = (obj) => {
    const a = []
    for (const id in obj) {
      a.push(obj[id])
    }
    return a
  }
}
