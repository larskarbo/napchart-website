import React from 'react'
import classNames from 'clsx'
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
      <div
        className={classNames('color', 'napchartDontLoseFocus', {
          active: color == this.props.activeColor,
        })}
        key={color}
        onClick={this.props.onClick.bind(null, color)}
      >
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill={colors[color]} />
        </svg>
      </div>
    ))
    return <div className="ColorPicker">{dom}</div>
  }
}
