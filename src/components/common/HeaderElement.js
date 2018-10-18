import React from 'react'

export default class HeaderElement extends React.Component {
	
  render () {
    return (
        <span>{this.props.children}</span>
        )
  }

}