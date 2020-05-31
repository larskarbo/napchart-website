import React, { Component } from 'react'
import server from '../../../server'
import Feedback from './Feedback'
import Shapes from '../small/Shapes'
import SuperLanes from '../small/SuperLanes'
import SelectedElement from '../small/SelectedElement'

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
            <Feedback />

          </div>

        </div>
      </div>
    )
  }


  sendFeedback = (tab) => {
    var value = this.refs.feedback.value


    server.sendFeedback(value, () => {
      console.log('feedback sent')
      this.refs.feedback.style.display = 'none'
      this.refs.feedbacksend.style.display = 'none'
      this.refs.afterfeedback.style.display = 'block'
    })


  }
};
