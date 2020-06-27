import React from 'react'
import uuid from 'uuid'
import Napchart from 'napchart'

export default class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: uuid.v4(),
    }
  }

  componentDidMount() {
    var resizer = this.refs.resizer

    this.updateDimensions(() => this.initializeChart())

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  componentWillUpdate() {
    return false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialData != this.props.initialData) {
      this.initializeChart()
    }
  }

  render() {
    var blurClass = ''
    if (this.props.loading) {
      blurClass = 'blur'
    }
    return (
      <div className="Chart" ref="resizer">
        <canvas
          className={'canvas ' + blurClass}
          width={this.state.width}
          height={this.state.height}
          ref={this.state.id}
        >
          A chart
        </canvas>
      </div>
    )
  }

  handleResize = () => {
    this.updateDimensions(() => this.props.napchart.updateDimensions())
  }

  updateDimensions = (callback) => {
    var resizer = this.refs.resizer
    this.setState(
      {
        width: resizer.clientWidth,
        height: resizer.clientHeight,
      },
      callback,
    )
  }

  initializeChart() {
    var canvas = this.refs[this.state.id]
    var ctx = canvas.getContext('2d')

    // first check if we should fetch some data
    //
    // returns {} if no data was loaded (you are on base napchart.com/app)
    // returns the data if you are on napchart.com/xxxxx
    var napchart = Napchart.init(ctx, this.props.initialData || {}, {
      responsive: true,
      ampm: this.props.ampm,
    })

    napchart.onUpdate = () => {
      this.props.onUpdate()
    }

    // for debugging
    window.napchart = napchart

    canvas.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    this.props.setGlobalNapchart(napchart)

    // if (Object.keys(this.props.initialData).length) {
    //   console.log('this.props.initialData: ', this.props.initialData)
    //   this.props.setMetaInfo(this.props.initialData.metaInfo.title, this.props.initialData.metaInfo.description)
    // }
    // })
  }
}
