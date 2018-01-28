
import c from 'classnames'

import React from 'react'

import Logo from '../common/Logo.jsx'
import Link from '../common/Link.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  render () {
    return (
      <div>
        <section className="section hero is-dark is-bold is-fullheight">
          <div className="hero-body">
            <div className="container">
            <div className="column is-6 is-offset-3 has-text-centered">
              <div className="box">
                
                <div className="field">
                  <label className="label">Username</label>
                  <div className="control">
                    <input ref="username" className="input" type="text" placeholder="Text input" value="bulma" />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input ref="password" className="input" type="password" placeholder="Text input" value="bulma" />
                  </div>
                </div>


                <div className="field">
                  <a className={c("button","is-primary",{'is-loading': this.state.loading})}
                    onClick={this.login}>Log in</a>
                </div>


                <div className="field">
                  <div className="notification">
                    We saved your chart anonymously. Login and we'll transfer it to your account. 
                  </div>
                </div>
              </div>

              <div className="box">
                <p>Don't have an account? <Link href="/sign-up">Sign up</Link></p>
              </div>
            </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  login = () => {
    var username = this.refs.username
    var password = this.refs.password

    console.log(username, password)

    this.setState({
      loading: true
    })
  }
}
