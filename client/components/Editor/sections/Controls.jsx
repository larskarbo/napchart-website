import React, { Component } from 'react'

import Shapes from '../small/Shapes.jsx'
import SuperLanes from '../small/SuperLanes.jsx'
import SelectedElement from '../small/SelectedElement.jsx'

export default class Controls extends Component {
  render() {
    var { napchart } = this.props
    if (!napchart) {
      return null
    }
    return (
      <div>
        <div>
          <div>
            <div className="part">
              <Shapes napchart={napchart} />
            </div>
            <div className="part">
              <SuperLanes
                napchart={napchart}
              />
            </div>
            <div className="part">
              <div className="field title is-6">
                Color:
              </div>
              <SelectedElement napchart={napchart} />
            </div>
          </div>
        </div>
      </div>
    )
  }
};
