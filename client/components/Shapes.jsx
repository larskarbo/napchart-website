import React from 'react'


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
      var className = ""
      if(napchart.data.shape == shape){
        var className = "active"
      }
      return (
        <button className={"button " + className}
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
