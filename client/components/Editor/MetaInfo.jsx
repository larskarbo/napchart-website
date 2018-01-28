
import React from 'react'

export default class extends React.Component {

  render () {
    return (
      <div className="MetaInfo">
        <div className="field">
          <div className="control">
            <input className="input" type='text' placeholder='Title'
               onChange={this.props.changeTitle}
               value={this.props.title} />
          </div>
        </div>


        <div className="field">
          <div className="control">
            <textarea className="textarea" type='text' placeholder='Description'
             onChange={this.props.changeDescription}
             value={this.props.description}
              />
          </div>
        </div>
      </div>
    )
  }

  
}
