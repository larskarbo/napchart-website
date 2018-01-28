
import React from 'react'
import server from '../../../server'


export default class extends React.Component {

  render () {
    return (
      <div className='Info'>
        <div className="quickstart">
        <div id="debug"></div> 
          <p>Napchart is a time planning tool that helps you visualize time around a 24 hour clock.</p>
          
          <p><strong>Create element:</strong> Click on an empty space on the chart and drag</p>
          <p><strong>Delete element:</strong> Set duration to zero or press delete</p>

        </div>
        <div className="padding">
          <h2>Feedback</h2>
          <p>Issues, ideas, or other feedback appreciated 😏</p>
          <textarea className="reset" ref="feedback"></textarea>
          <div style={{display:'none'}} ref="afterfeedback">
            <p>Thank you for your feedback ❤️🤗</p>
          </div>
          <button ref="feedbacksend" onClick={this.sendFeedback} className="button block">Send</button>
        </div>
        <div className="padding">
          <h2>Contribute</h2>
          <p>Napchart is open-source and hackable. Check out the projects on GitHub 🌟</p>
          <p><a target="_blank" href="fjdi"><strong>napchart-website</strong></a> on GitHub</p>
          <p><a target="_blank" href="fjdi"><strong>napchart</strong></a> on GitHub</p>
        </div>
      </div>
    )
  }
  
  sendFeedback = (tab) => {
    var value = this.refs.feedback.value


    server.sendFeedback(value, function() {
      console.log('feedback sent')
    })

    this.refs.feedback.style.display = 'none'
    this.refs.feedbacksend.style.display = 'none'
    this.refs.afterfeedback.style.display = 'block'

  }
}
