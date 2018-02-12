
import React from 'react'
import Logo from '../common/Logo.jsx'


export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editingTitle: false
    }
  }

  render() {
    return (
      <header className="Header level is-mobile">
        <div className="level-left">
          <a href="/app">
            <Logo className="cornerLogo level-item" white height="45" loading={this.props.loading} whiteBG />
          </a>
          <div className="meta level-item">
            <div className="chartTitle">
              {this.state.editingTitle &&
                <input type='text' placeholder='Untitled'
                  ref={this.focusField}
                  onBlur={this.editTitleOff}
                  onChange={this.props.changeTitle}
                  value={this.props.title} />
              }
              {!this.state.editingTitle && this.props.chartid &&
                <h1 onClick={this.editTitle}>
                  {this.props.title || 'Untitled'}
                </h1>
              }
              {!this.state.editingTitle && !this.props.chartid &&
                <h1>
                  Unsaved chart
                </h1>
              }
            </div>
            {//this.props.chartid &&
              // <div className="byline">
              //   A chart by
              //   <b>
              //     {this.props.user &&
              //       <a className="has-text-white" href={'user/' + this.props.user.username}>
              //         {' ' + this.props.user.username}
              //       </a>
              //     }
              //     {!this.props.user && ' anonymous'}
              //   </b>
              // </div>
            }
          </div>
        </div>

        <div className="level-right">

          <a onClick={this.props.save} className="button is-light level-item">Save</a>

          {/* {!this.props.userOwnsThisChart &&
            <a onClick={this.props.save} className="button is-small is-light level-item">Salve</a>
          }

          {this.props.chartid &&
            <a onClick={this.props.save} className="button is-small is-light level-item">Fork</a>
          }

          {this.props.chartid && this.props.userOwnsThisChart &&
            <a onClick={this.props.save} className="button is-small is-light level-item">Update</a>
          } */}
        </div>

      </header>
    )
  }

  editTitle = () => {
    this.setState({
      editingTitle: true
    })
  }

  editTitleOff = () => {
    this.setState({
      editingTitle: false
    })
  }

  focusField = (input) => {
    if (!input) {
      return
    }
    const length = input.value.length;
    input.focus();
    input.setSelectionRange(length, length);
  }
}
