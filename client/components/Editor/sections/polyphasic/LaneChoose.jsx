
import React from 'react'
import classNames from 'classnames'

export default class Elements extends React.Component {
  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    console.log('drawing');

    var laneButtons = [1, 2, 3, 4].map(lane => {
      var disabled = this.props.disabledLane(lane)
      console.log(disabled);
      var classes = {
        active: lane - 1 == this.props.active,
        disabled: disabled
      }
      return (
        <button className={classNames('button', classes)}
          disabled={disabled}
          onClick={!disabled && this.props.clickLane.bind('', (lane - 1))}
          key={lane}>
          {lane}
        </button>
      )
    })
    return (
      <div className="lanes">
        Lane: {laneButtons}
      </div>
    )
  }
}
