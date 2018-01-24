import React from 'react'
import c from 'classnames'


export default class Chart extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    var napchart = this.props.napchart
    if(!napchart){
      return null
    }
  	var shapes = ['circle', 'wide', 'line']

  	var shapeButtons = shapes.map(shape => {
      var classes = {
        active: napchart.data.shape == shape
      }
      return (
        <button className={c("button", "napchartDontLoseFocus", classes)}
        onClick={napchart.changeShape.bind(napchart, shape)}
        key={shape}>
          {shape}
        </button>
      )
  	})
    return (
      <div className="shapes">
        Shape: {shapeButtons}
      </div>)
  }
}
