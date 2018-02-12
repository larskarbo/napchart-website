
import React from 'react'

export default class UserBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    var { user } = this.props
    return (
      <div className="UserBox level is-mobile">
        <div className="level-left">
          Hi {user.username}

          {!this.props.user &&
            <div>
              <a onClick={this.props.save} className="button is-small is-light level-item">Log in</a>
              <a onClick={this.props.save} className="button is-small is-light level-item">Register</a>
            </div>
          }
        </div>
      </div>
    )
  }
}
