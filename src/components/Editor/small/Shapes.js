import React from 'react'
import c from 'classnames'


export default class Chart extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    var shapes = ['circle', 'wide', 'line']

    var shapeButtons = shapes.map(shape => {
      var classes = {
        'is-active': napchart.data.shape == shape,
        'is-primary': napchart.data.shape == shape
      }
      return (
        <p className="control" key={shape}>
          <button className={c("button", "is-small", "napchartDontLoseFocus", classes)}
            onClick={napchart.changeShape.bind(napchart, shape)}
          >
            {shape}
          </button>
        </p>
      )
    })
    return (
      <div className="field has-addons level is-mobile">
        <div className="level-left">
          <div className="level-item title is-6">
            Shape:
          </div>
          <div className="level-item">
            {shapeButtons}
          </div>
        </div>
      </div>
    )
  }
}
