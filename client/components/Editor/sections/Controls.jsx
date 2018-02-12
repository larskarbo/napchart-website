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

            <div className="field">
              <div className="level is-mobile">
                <div className="level-item">
                  <button
                    onClick={napchart.history.back.bind(napchart)}
                    className="button is-small"
                    disabled={!napchart.history.canIGoBack()}
                    title={"Undo " + napchart.history.canIGoBack()}
                  >Undo</button>
                </div>
                <div className="level-item">
                  <button
                    onClick={napchart.history.forward.bind(napchart)}
                    className="button is-small"
                    disabled={!napchart.history.canIGoForward()}
                    title={"Redo " + napchart.history.canIGoForward()}>Redo</button>
                </div>
              </div>
            </div>

            <div className="field">
              <Shapes napchart={napchart} />
            </div>
            {/* <div className="field">
              <SelectedElement napchart={napchart} />
            </div> */}

            <div className="field">
              <SuperLanes
                napchart={napchart}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
};
