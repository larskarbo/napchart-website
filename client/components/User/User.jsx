
import classNames from 'classnames'

import React from 'react'

import Logo from '../common/Logo.jsx'
import Link from '../common/Link.jsx'

export default class extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
    console.log(props)
  }

  render () {
    return (
      <div>
      	<h1>HI {this.props.user.username}</h1>

      </div>
    )
  }
}
