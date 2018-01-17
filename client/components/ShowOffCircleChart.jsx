// data lives here (no it doesn't)

import React from 'react'
import Elements from './Elements.jsx'
import uuid from 'uuid'
import Napchart from 'napchart'

import server from '../server'

export default class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: uuid.v4()
    }
  }

  componentDidMount () {
    this.initializeChart()
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.handleResize)
  }

  render () {
    return (
      <canvas className="canvas" width={this.props.width} height={this.props.height} ref={this.state.id}>
        A chart
      </canvas>
    )
  }

  initializeChart () {
    var canvas = this.refs[this.state.id]
    var ctx = canvas.getContext('2d')

    var napchart = Napchart.init(ctx, {}, {
	    responsive: true
	  })

    this.setState({
      napchart
    })
  }
}
