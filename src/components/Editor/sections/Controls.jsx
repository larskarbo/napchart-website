import React, { Component } from 'react'
import server from '../../../server'

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
            <div className="part">
              <h2 className="title is-6">Feedback</h2>
              <p className="field">Issues, ideas, or other feedback appreciated 😏</p>
              <textarea className="textarea field" ref="feedback"></textarea>
              <div className="field" style={{ display: 'none' }} ref="afterfeedback">
                <p>Thank you for your feedback ❤️🤗</p>
              </div>
              <button ref="feedbacksend" onClick={this.sendFeedback} className="button block">Send</button>
            </div>

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
