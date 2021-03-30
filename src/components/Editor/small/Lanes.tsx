import React from 'react'
import c from 'clsx'
import Button from '../../common/Button';

export default class Lanes extends React.Component {
  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    // generate array with laneIndexes: [0,1,2,3,4]
    var laneIndexes = []
    for (let i = 0; i < napchart.data.lanes; i++) {
      laneIndexes.push(i)
    }
    var laneButtons = laneIndexes.map((index) => {
      var disabled = this.props.disabledLane(index)
      var classes = {
        'bg-gray-800 text-white': index == this.props.active,
        disabled: disabled,
        napchartDontLoseFocus: true,
      }
      return (
        <Button key={index}
          small
          className={c(classes, "mx-1")}
          onClick={!disabled && this.props.clickLane.bind('', index)}
          disabled={disabled}
        >
          {index + 1}
        </Button>
      )
    })

    const activeLaneConfig = napchart.getLaneConfig(this.props.active)
    return (
      <div className="field has-addons level is-mobile">
        <div className="flex">
          <div className="">Lane:</div>
          <div className="mx-1 flex">{laneButtons}</div>
          <div className="mx-1 flex">
            <Button
              small
              onClick={napchart.toggleLockLane.bind(napchart, this.props.active)}
              className={c(activeLaneConfig.locked && 'bg-gray-800 text-white')}
            >
              Lock
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
