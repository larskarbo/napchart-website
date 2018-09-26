import React from 'react'
import c from 'classnames'

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
        button: true,
        'is-active': index == this.props.active,
        'is-dark': index == this.props.active,
        disabled: disabled,
        napchartDontLoseFocus: true
      }
      return (
        <p className="control" key={index}>
          <button className={c(classes)}
            onClick={!disabled && this.props.clickLane.bind('', index)}
            disabled={disabled}
          >
            {index + 1}
          </button>
        </p>
      )
    })

    const activeLaneConfig = napchart.getLaneConfig(this.props.active);
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
              onClick={napchart.toggleLockLane.bind(napchart, this.props.active)}
              className={c("button is-small", { 'is-active': activeLaneConfig.locked, 'is-dark': activeLaneConfig.locked })}>Lock</button>
          </div>
        </div>
      </div>
    )
  }
}
