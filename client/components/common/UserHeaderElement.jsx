import React from 'react'
import classNames from 'classnames'
import HeaderElement from './HeaderElement.jsx'


export default class extends React.Component {
	
  render () {
  	var user = this.props.user
    return (
      <div>
        { !user &&
          <HeaderElement href="/login">
            Log in
          </HeaderElement>
        }
      </div>
    )
  }

  doNothing = () => {}
}