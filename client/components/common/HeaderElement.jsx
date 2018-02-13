import React from 'react'
import classNames from 'classnames'
import Link from './Link.jsx'

export default class HeaderElement extends React.Component {
	
  render () {
    if(typeof this.props.onClick == 'undefined'){
      var onClick = this.doNothing
    }else {
      var onClick = this.onClick
    }
    return (
      <Link style={this.props.style} href={this.props.href}
      className={classNames('HeaderElement',this.props.className,{right:this.props.right})}
      onClick={this.props.onClick}>
        <span>{this.props.children}</span>
        
      </Link>)
  }

  doNothing = () => {}
}