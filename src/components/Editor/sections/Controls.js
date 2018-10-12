import React, { Component } from 'react'

import Shapes from '../small/Shapes.js'
import SuperLanes from '../small/SuperLanes.js'
import SelectedElement from '../small/SelectedElement.js'

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
            <div className="part fullWidth">
              {/* <div className="field title is-6">
                Description:
              </div> */}
              <textarea type='text' className="description" placeholder='Describe this chart'
                onChange={this.props.changeDescription}
                value={this.props.description} />
            </div>
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
