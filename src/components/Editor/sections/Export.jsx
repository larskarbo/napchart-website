
import React from 'react'

export default class extends React.Component {

  render() {
    return (
      <div className="Export">

        {!this.props.chartid &&
          <div>Save your Napchart to share it</div>
        }
        {this.props.chartid &&
          <div>
            <div className="field">
              <label className="label">URL</label>
              <div className="control">
                <input onChange={() => { }} ref={this.userJustSaved} className="input" type="text" value={this.props.url + this.props.chartid} />
              </div>
            </div>
            <div className="field">
              <label className="label">IMAGE</label>
              <div className="control">
                <a href={'http://thumb.napchart.com:1771/api/getImage?width=600&height=600&chartid=' + this.props.chartid}
                >Image link (600x600)</a>
              </div>
            </div>
            <div className="field">
              <label className="label">EMBED</label>
              <div className="control">
                Embed is possible with the <a target="_blank" href="https://github.com/larskarbo/napchart">napchart library</a>
              </div>
            </div>

            <div className="field">
              <label className="label">CSV</label>
              <div className="control">
                {/* <a onClick={() => { csvExport() }} className="button">Download csv</a> */}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  userJustSaved = (input) => {

    const url = window.location.toString()
    if (url.includes('s=1')) {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)

      // remove tag from url
      const cleanUrl = url.split("?")[0].split("#")[0];
      window.history.replaceState({}, document.title, cleanUrl)

      return true
    }
  }
}
