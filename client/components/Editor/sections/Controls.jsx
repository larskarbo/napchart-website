import React, { Component } from 'react'

import Shapes from '../small/Shapes.jsx'
import Lanes from '../small/Lanes.jsx'
import SelectedElement from '../small/SelectedElement.jsx'

export default class Controls extends Component {
  render() {
    return (
      <div>
        <div>
          <div className="field">
            <Lanes
              napchart={this.props.napchart}
              clickLane={this.props.setNumberOfLanes}
            />
          </div>
          <div className="field">
            <Shapes napchart={this.props.napchart} />
          </div>
          <div className="field">
            <SelectedElement napchart={this.props.napchart} />
          </div>
        </div>
      </div>
    )
  }
};
