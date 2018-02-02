import React from 'react'
import classNames from 'classnames'

export default class Lanes extends React.Component {
  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    var laneButtons = [1, 2, 3, 4].map(lane => {
      var disabled = this.props.disabledLane(lane)
      var classes = {
        button: true,
        'is-active': lane == this.props.active,
        'is-dark': lane == this.props.active,
        disabled: disabled,
        napchartDontLoseFocus: true
      }
      return (
        <p className="control" key={lane}>
          <button className={classNames(classes)}
            onClick={!disabled && this.props.clickLane.bind('', lane)}
            disabled={disabled}
          >
            {lane}
          </button>
        </p>
      )
    })
    return (
      <div className="field has-addons level is-mobile">
        <div className="level-left">
          <div className="level-item">
            Lanes:
          </div>
          <div className="level-item">
            {laneButtons}
          </div>
        </div>
      </div>
    )
  }
}
