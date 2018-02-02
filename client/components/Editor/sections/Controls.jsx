import React, { Component } from 'react'

import Shapes from '../small/Shapes.jsx'
import Lanes from '../small/Lanes.jsx'
import SelectedElement from '../small/SelectedElement.jsx'

export default class Controls extends Component {
  render() {
    var { napchart } = this.props
    return (
      <div>
        <div>
          <div className="field">
            <Lanes
              napchart={napchart}
              clickLane={this.props.setNumberOfLanes}
              active={napchart.data.lanes}
              disabledLane={(lane) => lane <= napchart.whichLaneIsTheLastOccupied()}
            />
          </div>
          <div className="field">
            <Shapes napchart={napchart} />
          </div>
          <div className="field">
            <SelectedElement napchart={napchart} />
          </div>
        </div>
      </div>
    )
  }
};
