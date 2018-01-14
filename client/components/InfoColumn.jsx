import React from 'react'
import classNames from 'classnames'
import Polyphasic from './add-ons/polyphasic/Polyphasic.jsx'

export default class InfoColumn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeTab:'about'
    }
  }

  render () {
    var tabs = []
    var about = (
      <div className='infoColumn'>
        <div className="quickstart">
          <p>Napchart is a time planning tool that helps you visualize time around a 24 hour clock.</p>
          
          <p><strong>Create element:</strong> Click on an empty space on the chart and drag</p>
          <p><strong>Delete element:</strong> Set duration to zero or click the delete button</p>

        </div>
        <div className="padding">
          <h2>Contribute</h2>
          <p>Napchart is open-source and hackable. Check out the projects on github</p>
          <p><a target="_blank" href="fjdi"><strong>napchart-website</strong></a> on GitHub</p>
          <p><a target="_blank" href="fjdi"><strong>napchart</strong></a> on GitHub</p>
        </div>
        <div className="padding">
          <h2>Iphone/Android app</h2>

          <p>Nope, not yet</p>
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
        {howMany > 1 && Object.keys(tabs).map(tab => (
          <button className={classNames('button', {active:tab == this.state.activeTab})}
          onClick={this.changeTab.bind('', tab)}>{tab}</button>
        ))}
      </div>
    )

    return (
      <div className="column right">
        {tabsRender}
        {tabs[this.state.activeTab]}
      </div>
    )
  }

  changeTab = (tab) => {
    console.log(tab)
    this.setState({
      activeTab: tab
    })
  }
}
