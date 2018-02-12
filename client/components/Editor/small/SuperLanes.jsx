import React from 'react'
import c from 'classnames'

export default class extends React.Component {
  render() {
    var napchart = this.props.napchart
    if (!napchart) {
      return null
    }
    var lanes = napchart.data.lanes.map((lane, index) => (
      <div className="field domLane fullWidth" key={index}>
        <div className="level is-mobile">
          <div className="level-left">
            <p>{index + 1}	 {this.duration(index)}</p>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button
                onClick={napchart.toggleLockLane.bind(napchart, index)}
                className={c("button is-small", { 'is-active': lane.locked, 'is-dark': lane.locked })}>Lock</button>
            </div>
            <div className="level-item">
              <button onClick={napchart.deleteLane.bind(napchart, index)}
                className="button is-small"
                disabled={napchart.data.lanes.length == 1}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    ))
    return (
      <div className="field SuperLanes">
        <p className="field title is-6">Lanes:</p>
        <div className="field">
          {lanes}
        </div>
        <button onClick={napchart.addLane.bind(napchart)}
          className="button is-small">Add lane +</button>
      </div>
    )
  }

  duration = (laneIndex) => {
    const helpers = napchart.helpers
    const minutes = napchart.data.elements.reduce((minutes, element) => {
      if (element.lane == laneIndex) {
        return minutes + helpers.duration(element.start, element.end)
      } else {
        return minutes
      }
    }, 0)
    return helpers.minutesToReadable(minutes)
  }
}
