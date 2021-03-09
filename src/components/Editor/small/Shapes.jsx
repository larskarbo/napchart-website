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

    return (
      <div className="flex">
        <div className="flex items-center font-bold mr-2">Shape:</div>
        <div className="flex">
          {shapes.map((shape) => {
            return (
              <button
                key={shape}
                className={`
            px-2 py-1 bg-gray-50 rounded-md border text-xs
            ${napchart.data.shape == shape && 'bg-red-600 text-white'}`}
                onClick={() => napchart.changeShape(shape)}
              >
                {shape}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
}
