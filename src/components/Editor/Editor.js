
import c from 'classnames'

import React from 'react'

import Header from './Header.js'

import helpers from '../../renderers/two24/helpers'

import server from '../../utils/serverCom'
import Two24 from '../../renderers/two24'
// import React24 from '../../renderers/react24'
// import Canvas24 from '../../renderers/canvas24'

import Element from './models/Element'
import Value from './models/Value'
import Operation from './models/Operation'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    const value = new Value({
      onChange: this.onValueChange
    })
    
    
    value
      .addElement({
        title: 'Element 1',
        start: 8 * 60 + 15,
        end: 10 * 60 + 15,
        color: 'pink'
      })
      .addElement({
        title: 'Picknic',
        start: 0 * 60 + 15,
        end: 2 * 60 + 15,
        color: 'green'
      })
      .addElement({
        title: 'School',
        start: 15 * 60 + 15,
        end: 18 * 60,
        color: 'yellow'
      })

    this.state = {
      value: value
    }
  }

  onValueChange = (newValue, operations) => {
    // Update state
    this.setState({
      value: newValue
    })

    // Also send operations directly to renderer
    this.renderer.onOperations(operations)
  }


  changeElement = (id, newAttrs) => {
    const operations = [
      new Operation('change_element', {
        id,
        ...newAttrs
      })
    ]

    this.state.value.applyOperations(operations)
  }

  selectElement = id => {
    // this.deselect()

    const operations = [
      new Operation('select_element', {
        id
      })
    ]

    this.state.value.applyOperations(operations)
  }

  deselectElement = id => {
    // this.ref.child('elements').child(id).update({
    //   selected: false
    // })
  }

  deselect = id => {
    // this.ref.child('elements').update(this.normalizeArray(this.state.elements.map(e => {
    //   return {
    //     ...e,
    //     selected: false
    //   }
    // })))
  }

  render() {
    return (
      <div className="Editor">
        <div className={c("grid", { slideSidebarMobile: this.state.slideSidebarMobile })}>
          <div className="sidebar">
            <Header
              title={this.state.value.title}
            />
          </div>

          <div className="main">
            <Two24
              value={this.state.value}

              changeElement={this.changeElement}
              selectElement={this.selectElement}
              deselectElement={this.deselectElement}
              deselect={this.deselect}
              ref={r => this.renderer = r}
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

  changeTitle = element => {
    this.setState({
      title: element.target.value
    })
  }

  changeDescription = element => {
    this.setState({
      description: element.target.value
    })
  }

  setNumberOfLanes = (lanes) => {
    this.state.napchart.setNumberOfLanes(lanes)
  }

  getAmpm = () => {

    // const cookiePref = Cookies.get('preferAmpm')
    // if (cookiePref) {
    //   return eval(cookiePref)
    // }

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
    // Cookies.set('preferAmpm', ampm)

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
