import React from 'react'
import Logo from '../common/Logo'
import c from 'classnames'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editingTitle: false,
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
              {this.state.editingTitle && (
                <input
                  type="text"
                  placeholder="Untitled"
                  ref={this.focusField}
                  onBlur={this.editTitleOff}
                  onChange={this.props.changeTitle}
                  value={this.props.title}
                />
              )}
              {!this.state.editingTitle && this.props.chartid && (
                <h1 onClick={this.editTitle}>{this.props.title || 'Untitled'}</h1>
              )}
              {!this.state.editingTitle && !this.props.chartid && <h1>Unsaved chart</h1>}
            </div>
          </div>
        </div>

        <div className="level-right">
          <a
            onClick={this.props.update}
            className={c('button is-light level-item', { 'is-loading': this.props.loading })}
          >
            Save
          </a>
          <a
            onClick={this.props.saveNew}
            className={c('button is-light level-item', { 'is-loading': this.props.loading })}
          >
            Save new
          </a>
        </div>
      </header>
    )
  }

  editTitle = () => {
    this.setState({
      editingTitle: true,
    })
  }

  editTitleOff = () => {
    this.setState({
      editingTitle: false,
    })
  }

  focusField = (input) => {
    if (!input) {
      return
    }
    const length = input.value.length
    input.focus()
    input.setSelectionRange(length, length)
  }
}
