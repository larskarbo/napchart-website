import React from 'react'
import classNames from 'classnames'
import Polyphasic from './add-ons/polyphasic/Polyphasic.jsx'
import Cookies from 'js-cookie'

import server from '../server'

export default class InfoColumn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeTab: Cookies.get('activeTab') || 'about',
      defaultTab: 'about',
      sidebarOpen: false
    }
  }

  componentWillReceiveProps () {
    // check if activeTab Exists
    if(!this.props.addOns[this.state.activeTab]){
      this.setState({
        activeTab: this.state.defaultTab
      })
    }
  }

  render () {
    var tabs = []
    var about = (
      <div className='infoColumn'>
        <div className="quickstart">
        <div id="debug"></div> 
          <p>Napchart is a time planning tool that helps you visualize time around a 24 hour clock.</p>
          
          <p><strong>Create element:</strong> Click on an empty space on the chart and drag</p>
          <p><strong>Delete element:</strong> Set duration to zero or press delete</p>

        </div>
        <div className="padding">
          <h2>Feedback</h2>
          <div className="notification">
            I wrote a post about <a href="https://blog.napchart.com/the-future-of-napchart">The Future of Napchart</a> on the new <a href="https://blog.napchart.com">Napchart Blog</a>.
            Feel free to comment there ✍️
          </div>
          <div style={{display:'none'}} ref="afterfeedback">
            <p>Thank you for your feedback ❤️🤗</p>
          </div>
        </div>
        <div className="padding">
          <h2>Contribute</h2>
          <p>Napchart is open-source and hackable. Check out the projects on GitHub 🌟</p>
          <p><a target="_blank" href="https://github.com/larskarbo/napchart-website"><strong>napchart-website</strong></a> on GitHub</p>
          <p><a target="_blank" href="https://github.com/larskarbo/napchart"><strong>napchart</strong></a> on GitHub</p>
        </div>
      </div>
    )

    var polyphasic = <Polyphasic napchart={this.props.napchart} />

    tabs.about = about

    if(this.props.addOns.polyphasic){
      tabs.polyphasic = polyphasic
    }
    var howMany = Object.keys(tabs).length
    var tabsRender = (
      <div className="tabs">
        {this.state.sidebarOpen &&
          <button className="button sidebarCloseButton"
          onClick={this.sideBarToggle}>Close sidebar</button>
        }
        {howMany > 1 && Object.keys(tabs).map(tab => (
          <button className={classNames('button', {active:tab == this.state.activeTab})}
          onClick={this.changeTab.bind('', tab)}>{tab}</button>
        ))}
      </div>
    )

    var sidebar = (
      <div className="sideBarToggle">
        <button className="button"
        onClick={this.sideBarToggle}>Open sidebar</button>
      </div>
    )

    if(this.state.sidebarOpen){

    }
    return (
      <div className="last">
        {!this.state.sidebarOpen &&
          <div className="sidebarOpenButton">
            <button className="button"
            onClick={this.sideBarToggle}>Open sidebar</button>
          </div>
        }
        <div className={classNames("column","right", "sidebar", {open: this.state.sidebarOpen})}>
          {tabsRender}
          {tabs[this.state.activeTab]}
        </div>
      </div>
    )
  }

  sideBarToggle = (tab) => {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen
    })
  }

  changeTab = (tab) => {
    console.log(tab)
    Cookies.set('activeTab', tab)
    this.setState({
      activeTab: tab
    })
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
