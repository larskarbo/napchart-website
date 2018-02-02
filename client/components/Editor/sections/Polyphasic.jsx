import React from 'react'
import sampleSchedules from './polyphasic/sampleSchedules.json'
import ColorPicker from '../small/ColorPicker.jsx'
import Lanes from '../small/Lanes.jsx'


export default class Polyphasic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sleepLane: 1,
      color: 'red'
    }
  }

  render() {
    return (
      <div>
        <div className="instruction">Clicking on any of these schedules will overwrite all elements in selected lane</div>
        <div>
          <Lanes
            napchart={this.props.napchart}
            clickLane={this.setLane}
            active={this.state.sleepLane}
            disabledLane={(lane) => lane > this.props.napchart.data.lanes}
          />
          <ColorPicker
            onClick={this.changeColor}
            activeColor={this.state.color}
          />
        </div>
        <div className="schedules">
          {sampleSchedules.map(schedule => (
            <button key={schedule.name} onClick={this.changeSchedule.bind(null, schedule)} className="button">{schedule.name}</button>
          ))}
        </div>
      </div>
    )
  }

  changeSchedule = (schedule) => {
    var lane = this.state.sleepLane - 1 // because napchart counts from 0, 1, 2 ...
    var elements = schedule.elements.map(element => {
      return {
        start: element.start,
        end: element.end,
        lane: lane,
        color: this.state.color
      }
    })
    var napchart = this.props.napchart
    napchart.emptyLane(lane)
    napchart.initAndAddElements(elements)

    // find a element on the lane and select it
    var eol = napchart.data.elements.find(e => e.lane == lane)
    napchart.setSelected(eol.id)
  }

  setLane = (lane) => {
    this.setState({
      sleepLane: lane
    })
  }

  changeColor = (color) => {
    this.setState({
      color: color
    })
  }

}