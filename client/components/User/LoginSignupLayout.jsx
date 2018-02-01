
import React from 'react'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <section className="section hero is-dark is-bold is-fullheight">
          <div className="hero-body">
            <div className="container">
  		        <div className="column is-6 is-offset-3 has-text-centered">
  		        	{this.props.children}
  		        </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

}
