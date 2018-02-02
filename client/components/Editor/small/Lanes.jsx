import React from 'react'
import classNames from 'classnames'

export default class Elements extends React.Component {
  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    var lanes = napchart.data.lanes
    var whichLaneIsTheLastOccupied = napchart.whichLaneIsTheLastOccupied()
    var laneButtons = [1, 2, 3, 4].map(lane => {
      var disabled = lane <= whichLaneIsTheLastOccupied
      var classes = {
        button: true,
        'is-active': lane == lanes,
        'is-dark': lane == lanes,
        disabled: disabled,
        napchartDontLoseFocus: true
      }
      return (
        <p className="control" key={lane}>
          <button className={classNames(classes)}
            onClick={!disabled && this.props.clickLane.bind('', lane)}
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
