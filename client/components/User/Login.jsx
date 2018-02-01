
import c from 'classnames'

import React from 'react'

import Logo from '../common/Logo.jsx'
import Link from '../common/Link.jsx'
import LoginSignupLayout from './LoginSignupLayout.jsx'

import server from '../../server'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  componentDidMount () {

  }

  render () {
    return (
      <LoginSignupLayout>
        <div className="box">
          <h1 className="title is-3 has-text-dark">Log in</h1>
          <form onSubmit={this.login}>
            <div className="field has-text-left">
              <label className="label">Username/email</label>
              <div className="control">
                <input ref="username" className="input" type="text" required />
              </div>
            </div>
            <div className="field has-text-left">
              <label className="label">Password</label>
              <div className="control">
                <input ref="password" className="input" type="password" required />
              </div>
            </div>


            <div className="field">
              <button type="submit" className={c("button","is-primary",{'is-loading': this.state.loading})}
                >Log in</button>
              <p className="help is-danger">{this.state.error}</p>
            </div>
          </form>


          {/*<div className="field">
            <div className="notification">
              We saved your chart anonymously. Login and we'll transfer it to your account. 
            </div>
          </div>*/}
        </div>

        <div className="box">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </LoginSignupLayout>
    )
  }

  login = (e) => {
    e.preventDefault()

    var username = this.refs.username.value
    var password = this.refs.password.value

    this.setState({
      loading: true,
      error: ''
    })

    server.login({
      username,
      password
    }, (err, res) => {

      this.setState({
        loading: false
      })
      if(err){
        this.setState({
          error: err
        })
      }else{
        window.location = window.siteUrl + 'user/' + res.username
      }
    })
  }
}
