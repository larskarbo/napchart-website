import React from 'react'
import clsx from 'clsx'
import { FaCheck } from 'react-icons/fa'
var colors = {
  red: '#D02516',
  blue: '#4285F4',
  brown: '#B15911',
  green: '#34A853',
  gray: '#949494',
  yellow: '#FBBC05',
  purple: '#730B73',
  pink: '#ff94d4',
}

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      panelOpen: false,
    }
  }

  render() {
    var colorsArray = Object.keys(colors)
    var dom = colorsArray.map((color) => (
      <button
        className={clsx('napchartDontLoseFocus flex center text-white text-xs flex-1 rounded-full h-8 mx-1 border-2', color == this.props.activeColor ? "border-black border-opacity-20 shadow" : "border-transparent")}
        style={{
          backgroundColor: colors[color]
        }}
        key={color}
        onClick={() => this.props.onClick(color)}
      >
        {color == this.props.activeColor && <FaCheck />}
      </button>
    ))
    return <div className="flex">{dom}</div>
  }
}
