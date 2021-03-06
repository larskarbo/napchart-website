import React, { Component, FunctionComponent } from 'react'
import { Feedback } from './Feedback'
import Shapes from '../small/Shapes'
import SuperLanes from '../small/SuperLanes'
import SelectedElement from '../small/SelectedElement'
import { NapChart } from '../napchart'

export const Controls = ({ napchart, description, changeDescription, title, changeTitle }) => {
  if (!napchart) {
    return null
  }
  return (
    <div>
      <div>
        <div>
          <div className="part fullWidth">
            <div className="font-bold pb-2">Title:</div>
            <input
              className="bg-transparent"
              placeholder="Title"
              onChange={(event) => changeTitle(event.target.value)}
              value={title}
              type="text"
            />
          </div>
          <div className="part fullWidth">
            <div className="font-bold pb-2">Description:</div>
            <textarea
              className="description"
              onChange={(event) => changeDescription(event.target.value)}
              placeholder="Describe this chart"
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
