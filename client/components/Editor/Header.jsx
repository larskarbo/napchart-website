
import React from 'react'
import Logo from '../common/Logo.jsx'


export default class extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editingTitle: false
    }
    console.log(this.state)
  }

  render () {
    return (
      <header className="Header level is-mobile">
        <div className="level-left">
          <a href="/app">
            <Logo className="cornerLogo level-item" white height="45" loading={this.props.loading} whiteBG />
          </a>
          <div className="meta level-item">
            <div className="chartTitle">
              {this.state.editingTitle &&
                <input type='text' placeholder='Title'
                 onChange={this.props.changeTitle}
                 value={this.props.title} />
              }
              {!this.state.editingTitle && this.props.chartid &&
                <a href={this.props.title}>
                  <h1>
                    {this.props.title || 'Untitled'}
                  </h1>
                </a>
              }
              {!this.state.editingTitle && !this.props.chartid &&
                <h1>
                  Unsaved chart
                </h1>
              }
            </div>
            {this.props.chartid &&
              <div className="byline">
                A chart by 
                {this.props.user &&
                  <a href={this.props.user.username}>
                    {this.props.user.username}
                  </a> 
                }
                {!this.props.user && ' anonymous'}
              </div>
            }
          </div>
        </div>

        {!this.props.chartid &&
          <div className="level-right">
            <a onClick={this.props.save} className="button is-small is-light level-item">Save</a>
          </div>
        }
        
      </header>
    )
  }
}
