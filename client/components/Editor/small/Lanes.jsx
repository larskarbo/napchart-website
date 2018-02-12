import React from 'react'
import c from 'classnames'

export default class Lanes extends React.Component {
  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    var laneButtons = napchart.data.lanes.map((lane, index) => {
      var laneIndex = index + 1
      var disabled = this.props.disabledLane(laneIndex)
      var classes = {
        button: true,
        'is-active': laneIndex == this.props.active,
        'is-dark': laneIndex == this.props.active,
        disabled: disabled,
        napchartDontLoseFocus: true
      }
      return (
        <p className="control" key={laneIndex}>
          <button className={c(classes)}
            onClick={!disabled && this.props.clickLane.bind('', laneIndex)}
            disabled={disabled}
          >
            {laneIndex}
          </button>
        </p>
      )
    })

    const activeLane = napchart.data.lanes[this.props.active - 1];
    return (
      <div className="field has-addons level is-mobile" >
        <div className="level-left">
          <div className="level-item">
            Lane:
          </div>
          <div className="level-item">
            {laneButtons}
          </div>
          <div className="level-item">
            <button
              onClick={napchart.toggleLockLane.bind(napchart, this.props.active - 1)}
              className={c("button is-small", { 'is-active': activeLane.locked, 'is-dark': activeLane.locked })}>Lock</button>
          </div>
        </div>
      </div>
    )
  }
}
