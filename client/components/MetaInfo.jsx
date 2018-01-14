
import React from 'react'
import Button from './Button.jsx'

export default class Elements extends React.Component {

  render () {
    return (
      <div className="metaInfo">
        <input className="title" type='text' placeholder='Title'
         onChange={this.props.changeTitle}
         value={this.props.title} />
        <textarea className="description" type='text'  placeholder='Description'
         onChange={this.props.changeDescription}
         value={this.props.description}
          />
      </div>
    )
  }
}
