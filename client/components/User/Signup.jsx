
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

  render () {
    var readyforSubmit = this.state.usernameAvailable && !this.state.emailInUse
    && !this.state.passwordValidationError


    return (
      <LoginSignupLayout>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        <div className="box">
          <h1 className="title is-3 has-text-dark">Sign up</h1>

          <form onSubmit={this.signup}>
            <div className="field has-text-left">
              <label className="label">Username</label>
              <div className="control">
                <input ref="username" onBlur={this.checkUsername} className="input" type="text" />
              </div>
              {this.state.usernameValidationError &&
                <p className="help is-danger">{this.state.usernameValidationError}</p>
              }
              {this.state.usernameAvailable &&
                <p className="help is-success">{this.state.usernameAvailable} is available</p>
              }
              {this.state.usernameNotAvailable &&
                <p className="help is-danger">{this.state.usernameNotAvailable} is not available</p>
              }
            </div>
            <div className="field has-text-left">
              <label className="label">E-mail</label>
              <div className="control">
                <input ref="email" onBlur={this.checkEmail} className="input" type="email" />
              </div>
              {this.state.emailValidationError &&
                <p className="help is-danger">{this.state.emailValidationError}</p>
              }
              {this.state.emailInUse &&
                <p className="help is-danger">{this.state.emailInUse} is already registered</p>
              }
            </div>
            <div className="field has-text-left">
              <label className="label">Password</label>
              <div className="control">
                <input onBlur={this.checkPassword} ref="password" className="input" type="password" />
              </div>
              {this.state.passwordValidationError &&
                <p className="help is-danger">Password must be at least 6 characters long</p>
              }
            </div>
          
            <div className="field">
              <div ref="captcha" className="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
              {/*<div className="g-recaptcha" data-sitekey="6LcKGUMUAAAAAG1zALXPY8rcHVZaooVszMzV-kd3"></div>
              */}
            </div>

            <div className="field">
              <button type="submit" disabled={!readyforSubmit} className={c("button","is-primary",{'is-loading': this.state.loading})}
                >Sign up</button>
              <p className="help is-danger">{this.state.error}</p>
            </div>
          </form>
        </div>

        <div className="box">
          <p>Already have an account? <Link href="/login">Log in</Link></p>
        </div>
      </LoginSignupLayout>
    )
  }

  checkUsername = () => {
    var value = this.refs.username.value

    this.setState({
      usernameAvailable: false,
      usernameNotAvailable: false
    })

    var usernamerules = /^(?!_)\w{3,15}$/
    if(!usernamerules.test(value)){
      this.setState({
        usernameValidationError: 'Username must be between 3 and 15 characters, and not consist of special characters'
      })
      return
    }

    this.setState({
      usernameValidationError: false
    })
    server.userAvailable('username', value, (err, available) => {
      if(err){
        return
      }
      if(available){
        this.setState({
          usernameAvailable: value,
        })
      } else {
        this.setState({
          usernameNotAvailable: value
        })
      }
    })
  }

  checkEmail = () => {
    var value = this.refs.email.value

    this.setState({
      emailInUse: false
    })

    var emailrules = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(!emailrules.test(value)){
      this.setState({
        emailValidationError: 'Email must be valid email address'
      })
      return
    }

    this.setState({
      emailValidationError: false
    })
    server.userAvailable('email', value, (err, available) => {
      if(!available){
        this.setState({
          emailInUse: value
        })
      }
    })
  }

  checkPassword = () => {
    var value = this.refs.password.value
    var passwordrules = /.{6,}$/
    if(!passwordrules.test(value)){
      this.setState({
        passwordValidationError: true
      })
      return
    }

    this.setState({
      passwordValidationError: false
    })
  }

  allValidate = () => {
    console.log(this.refs.username.value.length > 2
    ,this.refs.password.value.length > 5
    ,this.refs.email.value.length > 2)
    return this.refs.username.value.length > 2
    && this.refs.password.value.length > 5
    && this.refs.email.value.length > 2
    // && this.refs.captcha
  }

  signup = (e) => {
    e.preventDefault()
    console.log('sfdi')
    
    if(!this.allValidate()){
      return
    }
    this.setState({
      loading: true,
      error: ""
    })

    console.log(this.refs.captcha)

    server.signup({
      username: this.refs.username.value,
      password: this.refs.password.value,
      email: this.refs.email.value,
      captcha: this.refs.captcha.value
    }, (err, res) => {
      this.setState({
        loading: false
      })

      if(err){
        this.setState({
          error: err
        })
      }else {
        // no error
        window.location = window.siteUrl + 'user/' + res.username
      }
      
    })
  }
}
