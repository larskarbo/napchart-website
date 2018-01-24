import React from 'react'
import marked from 'marked'

import HeaderElement from '../common/HeaderElement.jsx'
import Logo from '../common/Logo.jsx'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    	md: ''
    }
  }

  componentDidMount() {
      fetch('/api/getBlogPost/dear-napchart-community').then((response) => {
        return response.json();
      }).then((md) => {
      	this.setState({
      		md: md
      	})
      });
      //this is where its recomended to make async calls. When the promise resolves 
      //the component will render again due to setState being called
      //and this time myData will be your data from the api
      //and now the tree component has what it needs to render the data
  }

  render () {
    return (
      <div className="pages">
        <div className='header'>
          <HeaderElement className="center" href="/app">
            <Logo noInteraction logoText="Napchart Blog" height="45" />
          </HeaderElement>

          <HeaderElement className="center" href="/app">
            <Logo white noInteraction logoText="App" height="45" />
          </HeaderElement>
        </div>


        <div className="wrapper">
          <div className="paper">
            <article className="segment" dangerouslySetInnerHTML={{__html:marked(this.state.md)}}>
            </article>
          </div>
        </div>


      </div>
    )
  }
}
