import React from 'react'
import uuid from 'uuid'
import Napchart from '../../canvas'

import serverCom from '../../utils/serverCom'

import Two24 from '../../views/two24'

export default class Chart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: uuid.v4(),
    }
  }

  render() {
    var blurClass = ''
    if (this.props.loading) {
      blurClass = 'blur'
    }
    return (
      <div>
        
      </div>
    )
  }
}
