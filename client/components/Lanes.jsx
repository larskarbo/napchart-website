
import React from 'react'
import Button from './Button.jsx'
import classNames from 'classnames'

export default class Elements extends React.Component {
  render () {
    var napchart = this.props.napchart
    if(!napchart){
      return null
    }
    var lanes = napchart.data.lanes
    var whichLaneIsTheLastOccupied = napchart.whichLaneIsTheLastOccupied()
    var laneButtons = [1,2,3,4].map(lane => {
      var disabled = lane <= whichLaneIsTheLastOccupied
      var classes = {
        button: true,
        active: lane == lanes,
        disabled: disabled
      }
      return (
        <button className={classNames(classes)}
        onClick={!disabled && this.props.clickLane.bind('', lane)}
        key={lane}>
          {lane}
        </button>
      )
    })
    return (
      <div className="lanes">
        Lanes: {laneButtons}
      </div>
    )
  }
}
