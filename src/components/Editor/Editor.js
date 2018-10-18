import React from 'react'
import c from 'classnames'
import Header from './Header.js'

import Svg24 from '../../renderers/svg24'

import Element from './models/Element'
import Value from './models/Value'
import Operation from './models/Operation'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    const value = new Value({
      onChange: this.onValueChange
    })

    this.state = {
      value: value
    }

  }

  componentDidMount() {
    /// add 3 initial elements
    const operations = [
      new Operation('add_element', {
        title: 'Element 1',
        start: 8 * 60 + 15,
        end: 10 * 60 + 15,
      }),
      new Operation('add_element', {
        title: 'Picknic',
        start: 0 * 60 + 15,
        end: 2 * 60 + 15,
      }),
      new Operation('add_element', {
        title: 'School',
        start: 15 * 60 + 15,
        end: 18 * 60,
      })
    ]
    setTimeout(() => {
      this.state.value.applyOperations(operations)
    }, 700)
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
    const operations = [
      new Operation('select_element', {
        id
      })
    ]

    this.state.value.applyOperations(operations)
  }

  deselectElement = id => {
    // TODO
  }

  deselect = () => {
    // TODO
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
            <Svg24
              value={this.state.value}

              changeElement={this.changeElement}
              selectElement={this.selectElement}
              deselectElement={this.deselectElement}
              deselect={this.deselect}
              ref={r => this.renderer = r}
            />
          </div>
        </div>
      </div>
    )
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

  setAmpm = (ampm) => {
    // Cookies.set('preferAmpm', ampm)

    this.setState({
      ampm: ampm
    })
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
