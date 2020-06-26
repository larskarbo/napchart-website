import React, { Component, FunctionComponent } from 'react'
import { Feedback } from './Feedback'
import Shapes from '../small/Shapes'
import SuperLanes from '../small/SuperLanes'
import SelectedElement from '../small/SelectedElement'
import { NapChart } from '../napchart'
type ControlsProps = {
  napchart: NapChart
  description: string
  changeDescription: (event: any) => void
}
export const Controls: FunctionComponent<ControlsProps> = ({ napchart, description, changeDescription }) => {
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
            <textarea
              className="description"
              placeholder="Describe this chart"
              onChange={changeDescription}
              value={description}
            />
          </div>
          <div className="part">
            <Shapes napchart={napchart} />
          </div>
          <div className="part">
            <SuperLanes napchart={napchart} />
          </div>
          <div className="part">
            <div className="field title is-6">Color:</div>
            <SelectedElement napchart={napchart} />
          </div>
          <Feedback />
        </div>
      </div>
    </div>
  )
}
