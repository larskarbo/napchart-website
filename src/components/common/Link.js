import React from 'react'
import history from '../../utils/history'

export default class extends React.Component {
	
  render () {
    return (
        <a style={this.props.style} className={this.props.className} 
          href={this.props.href} onClick={this.props.onClick || this.onClick}>
            {this.props.children}
        </a>
    );
  }

  onClick = (e) => {
      const aNewTab = e.metaKey || e.ctrlKey;
      const anExternalLink = this.props.href.startsWith('http');

      if (!aNewTab && !anExternalLink) {
          e.preventDefault();
          history.push(this.props.href);
      }
  };
}