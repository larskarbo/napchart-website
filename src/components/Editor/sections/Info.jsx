
import React from 'react'
import server from '../../../utils/serverCom'


export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ampmChanged: false
    }
  }

  render() {
    return (
      <div className='Info'>
        <div className="part">
          <div className="field">
            <p>Napchart is a time planning tool that helps you visualize time around a 24 hour clock.</p>
          </div>

          <div className="field">
            <p><strong>Create element:</strong> Click on an empty space on the chart and drag</p>
          </div>
          <div className="field">
            <p><strong>Delete element:</strong> Set duration to zero or press <kbd>delete</kbd> or <kbd>⌘-⌫</kbd></p>
          </div>
        </div>
        <div className="part">
          <h2 className="title is-6">Feedback</h2>
          {/* <p className="field">Issues, ideas, or other feedback appreciated 😏</p> */}
          {/* <textarea className="textarea field" ref="feedback"></textarea> */}
          <div className="field" style={{ display: 'none' }} ref="afterfeedback">
            <p>Thank you for your feedback ❤️🤗</p>
          </div>
          {/* <button ref="feedbacksend" onClick={this.sendFeedback} className="button block">Send</button> */}
        </div>
        <div className="part">
          <h2 className="title is-6">Contribute</h2>
          <p className="field">Napchart is open-source and hackable. Check out the projects on GitHub 🌟</p>
          <p className="field"><a target="_blank" href="https://github.com/larskarbo/napchart-website"><strong>napchart-website</strong></a> on GitHub</p>
          <p className="field"><a target="_blank" href="https://github.com/larskarbo/napchart"><strong>napchart</strong></a> on GitHub</p>
        </div>
        <div className="part">
          <label className="label">Time format</label>
          <div className="control">
            <label className="radio">
              <input type="radio" name="answer" onChange={this.changeAmpm.bind(null, true)} checked={this.props.ampm} />
              <span> AM/PM</span>
            </label>
            <label className="radio">
              <input type="radio" name="answer" onChange={this.changeAmpm.bind(null, false)} checked={!this.props.ampm} />
              <span> 24 hours</span>
            </label>
            {this.state.ampmChanged &&
              <p>Refresh to update</p>  
            }
          </div>
        </div>
      </div>
    )
  }

  changeAmpm = (ampm) => {
    console.log(ampm)
    this.props.setAmpm(ampm)
    this.setState({
      ampmChanged: true
    })
  }

  sendFeedback = (tab) => {
    var value = this.refs.feedback.value


    server.sendFeedback(value, function () {
      console.log('feedback sent')
    })

    this.refs.feedback.style.display = 'none'
    this.refs.feedbacksend.style.display = 'none'
    this.refs.afterfeedback.style.display = 'block'

  }
}
