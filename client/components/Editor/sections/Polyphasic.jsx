import React from 'react'
import sampleSchedules from './polyphasic/sampleSchedules.json'
import ColorPicker from '../small/ColorPicker.jsx'
import Lanes from '../small/Lanes.jsx'


export default class Polyphasic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sleepLane: 0,
      color: 'blue'
    }
  }

  render() {
    return (
      <div className="Polyphasic">
        <div className="field">Clicking on any of the schedules will overwrite all elements in the selected lane</div>
        <div className="field">
          <Lanes
            napchart={this.props.napchart}
            clickLane={this.setLane}
            active={this.state.sleepLane}
            disabledLane={(lane) => lane > this.props.napchart.data.lanes}
          />
        </div>
        <div className="field">
          <ColorPicker
            onClick={this.changeColor}
            activeColor={this.state.color}
          />
        </div>
        <div className="panel field">
          <p className="panel-heading">
            Schedules
          </p>
          {/* <div className="panel-block">
            <p className="control has-icons-left">
              <input className="input is-small" type="text" placeholder="search" />
              <span className="icon is-small is-left">
                <i className="fas fa-search"></i>
              </span>
            </p>
          </div> */}
          {/* <p className="panel-tabs">
            <a className="is-active">all</a>
            <a>public</a>
            <a>private</a>
            <a>sources</a>
            <a>forks</a>
          </p> */}


          {sampleSchedules.map(schedule => (
            <a key={schedule.name} className="panel-block"
              onClick={this.changeSchedule.bind(null, schedule)}>
              <div className="level is-mobile schedule">
                <div className="level-left">
                  <div className="level-item">
                    <span>{schedule.name}</span>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <span className="duration">{this.calculateDuration(schedule)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }

  calculateDuration = (schedule) => {
    var helpers = this.props.napchart.helpers
    const minutes = schedule.elements.reduce((minutes, element) => {
      return minutes + helpers.duration(element.start, element.end)
    }, 0)
    return helpers.minutesToReadable(minutes)
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
    napchart.history.add('Use polyphasic schedule')

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