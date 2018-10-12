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
      elements: [
        {
          title: 'Krets',
          start: 8 * 60 + 15,
          end: 10 * 60 + 15,
          color: 'pink'
        },
        {
          title: 'Matte 1',
          start: 10 * 60 + 15,
          end: 12 * 60 + 15,
          color: 'green'
        },
        {
          title: 'Elsys',
          start: 14 * 60 + 15,
          end: 18 * 60,
          color: 'yellow'
        }
      ]
    }
  }

  render() {
    var blurClass = ''
    if (this.props.loading) {
      blurClass = 'blur'
    }
    return (
      <div>
        <Two24
          elements={this.state.elements}
        />
      </div>
    )
  }
}
